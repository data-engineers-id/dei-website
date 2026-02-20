import { createClient } from '@supabase/supabase-js';
import type { Event } from '../types';

// Initialize Supabase client only if credentials are available
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || '';
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

// Only create client if both URL and key are provided
export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Check if Supabase is configured
const isSupabaseConfigured = !!supabase;

// Map Supabase snake_case response to camelCase Event interface
function mapDbEventToEvent(dbEvent: Record<string, unknown>): Event {
  return {
    id: dbEvent.id as string,
    title: dbEvent.title as string,
    slug: dbEvent.slug as string,
    description: dbEvent.description as string,
    excerpt: (dbEvent.excerpt as string) || '',
    startDate: new Date(dbEvent.start_date as string),
    endDate: dbEvent.end_date ? new Date(dbEvent.end_date as string) : undefined,
    timezone: (dbEvent.timezone as string) || 'Asia/Jakarta',
    locationType: (dbEvent.location_type as Event['locationType']) || 'virtual',
    venue: dbEvent.venue as string | undefined,
    address: dbEvent.address as string | undefined,
    city: dbEvent.city as string | undefined,
    virtualLink: dbEvent.virtual_link as string | undefined,
    coverImage: (dbEvent.cover_image as string) || '',
    category: dbEvent.category as string,
    tags: (dbEvent.tags as string[]) || [],
    status: (dbEvent.status as Event['status']) || 'upcoming',
    registrationUrl: dbEvent.registration_url as string | undefined,
    maxAttendees: dbEvent.max_attendees as number | undefined,
    registeredCount: (dbEvent.registered_count as number) || 0,
    createdAt: new Date(dbEvent.created_at as string),
    updatedAt: new Date(dbEvent.updated_at as string),
    publishedAt: new Date(dbEvent.published_at as string),
    isFeatured: (dbEvent.is_featured as boolean) || false,
  };
}

// Sample/Placeholder events for when Supabase is not configured
const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'DEI Workshop: Introduction to Data Engineering',
    slug: 'intro-to-data-engineering',
    description:
      'Join us for an introductory workshop on data engineering fundamentals. Learn about ETL pipelines, data warehousing, and modern data stack.',
    excerpt:
      'An introductory workshop covering data engineering fundamentals, ETL pipelines, and modern data stack.',
    startDate: new Date('2026-03-15T09:00:00'),
    endDate: new Date('2026-03-15T12:00:00'),
    timezone: 'Asia/Jakarta',
    locationType: 'virtual',
    virtualLink: 'https://zoom.us/j/example',
    coverImage: '',
    category: 'Workshop',
    tags: ['beginner', 'data-engineering', 'etl'],
    status: 'upcoming',
    maxAttendees: 100,
    registeredCount: 45,
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    isFeatured: true,
    registrationUrl: 'https://forms.google.com/example',
  },
  {
    id: '2',
    title: 'Building Data Pipelines with Apache Airflow',
    slug: 'data-pipelines-airflow',
    description:
      'Hands-on workshop on building and scheduling data pipelines using Apache Airflow.',
    excerpt:
      'Learn to build and schedule data pipelines using Apache Airflow in this hands-on workshop.',
    startDate: new Date('2026-04-20T13:00:00'),
    endDate: new Date('2026-04-20T16:00:00'),
    timezone: 'Asia/Jakarta',
    locationType: 'hybrid',
    city: 'Jakarta',
    venue: 'Tech Hub Jakarta',
    coverImage: '',
    category: 'Workshop',
    tags: ['airflow', 'pipelines', 'automation'],
    status: 'upcoming',
    maxAttendees: 50,
    registeredCount: 23,
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    isFeatured: true,
    registrationUrl: 'https://forms.google.com/example2',
  },
];

// Event Functions
export async function getEvents(): Promise<Event[]> {
  if (!isSupabaseConfigured) {
    console.log('Supabase not configured, returning sample events');
    return sampleEvents;
  }

  try {
    const { data, error } = await supabase!
      .from('events')
      .select('*')
      .order('start_date', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      return sampleEvents;
    }

    return data ? data.map(mapDbEventToEvent) : sampleEvents;
  } catch (error) {
    console.error('Error in getEvents:', error);
    return sampleEvents;
  }
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  if (!isSupabaseConfigured) {
    return sampleEvents.find(e => e.slug === slug) || null;
  }

  try {
    const { data, error } = await supabase!.from('events').select('*').eq('slug', slug).single();

    if (error) {
      console.error('Error fetching event:', error);
      return sampleEvents.find(e => e.slug === slug) || null;
    }

    return data ? mapDbEventToEvent(data) : null;
  } catch (error) {
    console.error('Error in getEventBySlug:', error);
    return sampleEvents.find(e => e.slug === slug) || null;
  }
}

export async function getFeaturedEvents(): Promise<Event[]> {
  if (!isSupabaseConfigured) {
    return sampleEvents.filter(e => e.isFeatured);
  }

  try {
    const { data, error } = await supabase!
      .from('events')
      .select('*')
      .eq('is_featured', true)
      .eq('status', 'upcoming')
      .order('start_date', { ascending: true })
      .limit(3);

    if (error) {
      console.error('Error fetching featured events:', error);
      return sampleEvents.filter(e => e.isFeatured);
    }

    return data?.length ? data.map(mapDbEventToEvent) : sampleEvents.filter(e => e.isFeatured);
  } catch (error) {
    console.error('Error in getFeaturedEvents:', error);
    return sampleEvents.filter(e => e.isFeatured);
  }
}
