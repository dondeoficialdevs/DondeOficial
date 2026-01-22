import { supabase } from './supabase';
import { Business, BusinessImage, Category, ApiResponse, BusinessFilters, Lead, NewsletterSubscriber, LoginResponse, User, Review, ReviewRating } from '@/types';

// Utility to handle Supabase responses
const handleSupabaseResponse = <T>(data: T | null, error: any): ApiResponse<T> => {
  if (error) {
    console.error('❌ Supabase error:', error);
    return {
      success: false,
      data: null as unknown as T,
      message: error.message || 'Error occurred during database operation'
    };
  }
  return {
    success: true,
    data: data as T,
    count: Array.isArray(data) ? data.length : undefined
  };
};

export const businessApi = {
  // Obtener todos los negocios con filtros opcionales
  getAll: async (filters?: BusinessFilters): Promise<Business[]> => {
    let query = supabase
      .from('businesses')
      .select(`
        *,
        categories!left (name),
        business_images (*)
      `);

    // Only apply approved status filter if not explicitly searching for all
    if (!filters?.search && !filters?.category) {
      query = query.eq('status', 'approved');
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters?.category) {
      query = query.eq('categories.name', filters.category);
    }

    if (filters?.limit) {
      const offset = filters.offset || 0;
      query = query.range(offset, offset + filters.limit - 1);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map((b: any) => ({
      ...b,
      category_name: b.categories?.name,
      images: b.business_images
    }));
  },

  // Obtener negocio por ID
  getById: async (id: number): Promise<Business> => {
    const { data, error } = await supabase
      .from('businesses')
      .select(`
        *,
        categories (name),
        business_images (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      ...data,
      category_name: data.categories?.name,
      images: data.business_images
    };
  },

  // Obtener negocio por ID incluyendo pendientes (solo admin)
  getByIdForAdmin: async (id: number): Promise<Business> => {
    return businessApi.getById(id);
  },

  // Crear nuevo negocio
  create: async (businessData: Partial<Business>, images?: File[]): Promise<Business> => {
    // 1. Insertar el negocio
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .insert([businessData])
      .select()
      .single();

    if (businessError) throw businessError;

    // 2. Si hay imágenes, subirlas
    if (images && images.length > 0 && business) {
      await businessApi.addImages(business.id, images);
    }

    return business;
  },

  // Actualizar negocio
  update: async (id: number, businessData: Partial<Business>): Promise<Business> => {
    const { category_name, images, ...updateData } = businessData as any;
    const { data, error } = await supabase
      .from('businesses')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Eliminar negocio
  delete: async (id: number): Promise<void> => {
    // 1. Obtener todas las imágenes para borrarlas de Storage
    const { data: images } = await supabase
      .from('business_images')
      .select('image_url')
      .eq('business_id', id);

    // 2. Borrar de la tabla (esto debería borrar en cascada si está configurado, 
    // pero borramos del storage manualmente)
    if (images) {
      for (const img of images) {
        const path = img.image_url.split('/').pop();
        if (path) {
          await supabase.storage.from('businesses').remove([path]);
        }
      }
    }

    const { error } = await supabase
      .from('businesses')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Agregar imágenes a un negocio existente usando Supabase Storage
  addImages: async (id: number, images: File[]): Promise<BusinessImage[]> => {
    const uploadedImages: BusinessImage[] = [];

    for (const image of images) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Subir al bucket 'businesses'
      const { error: uploadError } = await supabase.storage
        .from('businesses')
        .upload(filePath, image);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        continue;
      }

      // 2. Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('businesses')
        .getPublicUrl(filePath);

      // 3. Guardar en la tabla business_images
      const { data: imageData, error: dbError } = await supabase
        .from('business_images')
        .insert([{
          business_id: id,
          image_url: publicUrl,
          cloudinary_public_id: filePath, // Reutilizamos esta columna para el path de Supabase
          is_primary: uploadedImages.length === 0
        }])
        .select()
        .single();

      if (!dbError && imageData) {
        uploadedImages.push(imageData);
      }
    }

    return uploadedImages;
  },

  // Eliminar una imagen específica
  deleteImage: async (businessId: number, imageId: number): Promise<void> => {
    // 1. Obtener el path para borrar del storage
    const { data: image } = await supabase
      .from('business_images')
      .select('cloudinary_public_id')
      .eq('id', imageId)
      .single();

    if (image?.cloudinary_public_id) {
      await supabase.storage.from('businesses').remove([image.cloudinary_public_id]);
    }

    // 2. Borrar de la tabla
    const { error } = await supabase
      .from('business_images')
      .delete()
      .eq('id', imageId);

    if (error) throw error;
  },

  // Obtener todos los negocios incluyendo pendientes y rechazados (solo admin)
  getAllForAdmin: async (): Promise<Business[]> => {
    const { data, error } = await supabase
      .from('businesses')
      .select(`
        *,
        categories (name),
        business_images (*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((b: any) => ({
      ...b,
      category_name: b.categories?.name,
      images: b.business_images
    }));
  },

  // Obtener negocios pendientes de verificación (solo admin)
  getPending: async (): Promise<Business[]> => {
    const { data, error } = await supabase
      .from('businesses')
      .select(`
        *,
        categories (name),
        business_images (*)
      `)
      .eq('status', 'pending');

    if (error) throw error;

    return (data || []).map((b: any) => ({
      ...b,
      category_name: b.categories?.name,
      images: b.business_images
    }));
  },

  // Aprobar negocio (solo admin)
  approve: async (id: number): Promise<Business> => {
    const { data, error } = await supabase
      .from('businesses')
      .update({ status: 'approved' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Rechazar negocio (solo admin)
  reject: async (id: number): Promise<Business> => {
    const { data, error } = await supabase
      .from('businesses')
      .update({ status: 'rejected' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

export const categoryApi = {
  // Obtener todas las categorías
  getAll: async (): Promise<Category[]> => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  // Obtener conteos de negocios por categoría
  getCounts: async (): Promise<Array<{ id: number; name: string; count: number }>> => {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, businesses(count)');

    if (error) throw error;

    return (data || []).map((c: any) => ({
      id: c.id,
      name: c.name,
      count: c.businesses ? (c.businesses[0]?.count || 0) : 0
    }));
  },

  // Obtener categoría por ID
  getById: async (id: number): Promise<Category> => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Crear nueva categoría
  create: async (categoryData: Partial<Category>): Promise<Category> => {
    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

export const leadsApi = {
  // Crear nuevo lead (formulario de contacto)
  create: async (leadData: {
    full_name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<Lead> => {
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Obtener todos los leads
  getAll: async (params?: { limit?: number; offset?: number }): Promise<Lead[]> => {
    let query = supabase.from('leads').select('*').order('created_at', { ascending: false });

    if (params?.limit) {
      const offset = params.offset || 0;
      query = query.range(offset, offset + params.limit - 1);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // Obtener lead por ID
  getById: async (id: number): Promise<Lead> => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },
};

export const reviewApi = {
  // Obtener todas las reseñas de un negocio
  getByBusinessId: async (businessId: number): Promise<Review[]> => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Obtener promedio de calificaciones de un negocio
  getRating: async (businessId: number): Promise<ReviewRating> => {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('business_id', businessId);

    if (error) throw error;

    if (!data || data.length === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }

    const total = data.length;
    const sum = data.reduce((acc, curr) => acc + curr.rating, 0);
    return {
      averageRating: sum / total,
      totalReviews: total
    };
  },

  // Crear nueva reseña
  create: async (reviewData: {
    business_id: number;
    rating: number;
    comment?: string;
    user_name?: string;
    user_email?: string;
  }): Promise<Review> => {
    const { data, error } = await supabase
      .from('reviews')
      .insert([reviewData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Eliminar reseña
  delete: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

export const newsletterApi = {
  // Suscribirse al newsletter
  subscribe: async (email: string): Promise<NewsletterSubscriber> => {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Obtener todos los suscriptores
  getAllSubscribers: async (params?: { limit?: number; offset?: number }): Promise<NewsletterSubscriber[]> => {
    let query = supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false });

    if (params?.limit) {
      const offset = params.offset || 0;
      query = query.range(offset, offset + params.limit - 1);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // Eliminar suscriptor
  deleteSubscriber: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// Health check endpoint (Simplified for Supabase)
export const healthApi = {
  // Verificar estado del API
  check: async (): Promise<{ message: string; status: string }> => {
    const { data, error } = await supabase.from('categories').select('id').limit(1);
    if (error) return { message: 'Database connection error', status: 'DOWN' };
    return { message: 'Supabase connection is OK', status: 'OK' };
  },
};

// Autenticación (Migrada a Supabase Auth)
export const authApi = {
  // Iniciar sesión
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const user: User = {
      id: data.user?.id as any,
      email: data.user?.email || '',
      full_name: data.user?.user_metadata?.full_name || email.split('@')[0],
    };

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('user', JSON.stringify(user));
    }

    return {
      accessToken: data.session?.access_token || '',
      refreshToken: data.session?.refresh_token || '',
      user
    };
  },

  // Cerrar sesión
  logout: async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error al cerrar sesión:', error);

    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('user');
    }
  },

  // Refrescar access token
  refreshToken: async (): Promise<string> => {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) throw new Error('No session available');
    return data.session.access_token;
  },

  // Verificar token
  verify: async (): Promise<User> => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error('Not authenticated');

    return {
      id: user.id as any,
      email: user.email || '',
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
    };
  },

  // Cambiar contraseña
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
  },

  // Obtener usuario actual
  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const userStr = sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Verificar si está autenticado
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('user') !== null;
  },
};