// Frontend Integration for Transponder Database
// Add this to your Next.js project for seamless database integration

import { createClient } from '@supabase/supabase-js';

// Types for transponder data
export interface TransponderEntry {
  id: string;
  make: string;
  make_name_normalized: string;
  model: string;
  year_from?: number;
  year_to?: number;
  year_display: string;
  transponder_type?: string;
  security_system?: string;
  oem_keys?: string;
  part_numbers?: string;
  difficulty_level?: number;
  programming_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface VehicleMake {
  id: string;
  make_name: string;
  make_name_normalized: string;
  total_models: number;
  verified_models: number;
  earliest_year?: number;
  latest_year?: number;
}

export interface TransponderFamily {
  id: string;
  family_name: string;
  family_code?: string;
  usage_count: number;
  make_count: number;
}

export interface SearchFilters {
  make?: string;
  model?: string;
  year?: number;
  transponder_family?: string;
  limit?: number;
}

export interface SearchResult {
  id: string;
  make_name: string;
  model_name: string;
  year_from?: number;
  year_to?: number;
  year_note?: string;
  transponder_family?: string;
  system_type?: string;
  oem_keys?: string;
  difficulty_level?: number;
  verification_status: string;
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Transponder Database API Class
export class TransponderAPI {
  
  /**
   * Search vehicles with advanced filtering
   */
  static async searchVehicles(filters: SearchFilters): Promise<SearchResult[]> {
    try {
      const { data, error } = await supabase.rpc('search_vehicles', {
        p_make: filters.make || null,
        p_model: filters.model || null,
        p_year: filters.year || null,
        p_transponder_family: filters.transponder_family || null,
        p_limit: filters.limit || 50
      });

      if (error) {
        console.error('Error searching vehicles:', error);
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Search vehicles error:', error);
      throw error;
    }
  }

  /**
   * Full-text search across all transponder data
   */
  static async fullTextSearch(searchTerm: string, limit: number = 20): Promise<any[]> {
    try {
      const { data, error } = await supabase.rpc('search_transponders_fulltext', {
        p_search_term: searchTerm,
        p_limit: limit
      });

      if (error) {
        console.error('Error in full-text search:', error);
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Full-text search error:', error);
      throw error;
    }
  }

  /**
   * Get exact vehicle match
   */
  static async getVehicleExact(make: string, model: string, year: number): Promise<any[]> {
    try {
      const { data, error } = await supabase.rpc('get_vehicle_exact', {
        p_make: make,
        p_model: model,
        p_year: year
      });

      if (error) {
        console.error('Error getting exact vehicle:', error);
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Get vehicle exact error:', error);
      throw error;
    }
  }

  /**
   * Get all vehicle makes with statistics
   */
  static async getVehicleMakes(): Promise<VehicleMake[]> {
    try {
      const { data, error } = await supabase
        .from('vehicle_summary')
        .select('*')
        .order('total_models', { ascending: false });

      if (error) {
        console.error('Error fetching vehicle makes:', error);
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Get vehicle makes error:', error);
      throw error;
    }
  }

  /**
   * Get transponder families with usage statistics
   */
  static async getTransponderFamilies(): Promise<TransponderFamily[]> {
    try {
      const { data, error } = await supabase
        .from('transponder_family_summary')
        .select('*')
        .order('usage_count', { ascending: false });

      if (error) {
        console.error('Error fetching transponder families:', error);
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Get transponder families error:', error);
      throw error;
    }
  }

  /**
   * Get optimized API data for frontend
   */
  static async getAPITransponderData(filters: {
    make?: string;
    model?: string;
    limit?: number;
  } = {}): Promise<TransponderEntry[]> {
    try {
      let query = supabase
        .from('api_transponder_search')
        .select('*');

      if (filters.make) {
        query = query.ilike('make', `%${filters.make}%`);
      }

      if (filters.model) {
        query = query.ilike('model', `%${filters.model}%`);
      }

      query = query
        .order('make')
        .order('model')
        .order('year_from', { ascending: false, nullsLast: true });

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching API transponder data:', error);
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Get API transponder data error:', error);
      throw error;
    }
  }

  /**
   * Get vehicle models for a specific make
   */
  static async getModelsForMake(make: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('api_transponder_search')
        .select('model')
        .ilike('make', `%${make}%`)
        .order('model');

      if (error) {
        console.error('Error fetching models for make:', error);
        throw new Error(error.message);
      }

      // Extract unique model names
      const uniqueModels = [...new Set(data?.map(item => item.model) || [])];
      return uniqueModels.sort();
    } catch (error) {
      console.error('Get models for make error:', error);
      throw error;
    }
  }

  /**
   * Get year range for a specific make/model
   */
  static async getYearRangeForVehicle(make: string, model: string): Promise<{
    earliest: number | null;
    latest: number | null;
    years: number[];
  }> {
    try {
      const { data, error } = await supabase
        .from('api_transponder_search')
        .select('year_from, year_to')
        .ilike('make', `%${make}%`)
        .ilike('model', `%${model}%`)
        .not('year_from', 'is', null);

      if (error) {
        console.error('Error fetching year range:', error);
        throw new Error(error.message);
      }

      if (!data || data.length === 0) {
        return { earliest: null, latest: null, years: [] };
      }

      const years = new Set<number>();
      let earliest = Infinity;
      let latest = -Infinity;

      data.forEach(item => {
        if (item.year_from) {
          years.add(item.year_from);
          earliest = Math.min(earliest, item.year_from);
          
          if (item.year_to) {
            for (let year = item.year_from; year <= item.year_to; year++) {
              years.add(year);
            }
            latest = Math.max(latest, item.year_to);
          } else {
            latest = Math.max(latest, item.year_from);
          }
        }
      });

      return {
        earliest: earliest === Infinity ? null : earliest,
        latest: latest === -Infinity ? null : latest,
        years: Array.from(years).sort((a, b) => a - b)
      };
    } catch (error) {
      console.error('Get year range error:', error);
      throw error;
    }
  }

  /**
   * Get database statistics for dashboard
   */
  static async getDatabaseStats(): Promise<{
    totalEntries: number;
    totalMakes: number;
    totalFamilies: number;
    recentEntries: number;
  }> {
    try {
      // Get total entries
      const { count: totalEntries } = await supabase
        .from('transponder_entries')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Get total makes
      const { count: totalMakes } = await supabase
        .from('vehicle_makes')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Get total families
      const { count: totalFamilies } = await supabase
        .from('transponder_families')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Get recent entries (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count: recentEntries } = await supabase
        .from('transponder_entries')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .gte('created_at', thirtyDaysAgo.toISOString());

      return {
        totalEntries: totalEntries || 0,
        totalMakes: totalMakes || 0,
        totalFamilies: totalFamilies || 0,
        recentEntries: recentEntries || 0
      };
    } catch (error) {
      console.error('Get database stats error:', error);
      throw error;
    }
  }
}

// React Hooks for common operations
import { useState, useEffect } from 'react';

export const useTransponderSearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);

  const search = async (filters: SearchFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await TransponderAPI.searchVehicles(filters);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResults([]);
    setError(null);
  };

  return { search, results, loading, error, reset };
};

export const useVehicleMakes = () => {
  const [makes, setMakes] = useState<VehicleMake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMakes = async () => {
      try {
        const data = await TransponderAPI.getVehicleMakes();
        setMakes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch makes');
      } finally {
        setLoading(false);
      }
    };

    fetchMakes();
  }, []);

  return { makes, loading, error };
};

// Utility functions
export const formatYearRange = (yearFrom?: number, yearTo?: number, yearNote?: string): string => {
  if (yearNote) return yearNote;
  if (yearFrom && yearTo) return `${yearFrom}-${yearTo}`;
  if (yearFrom) return `${yearFrom}+`;
  return 'Unknown';
};

export const getDifficultyLabel = (level?: number): string => {
  if (!level) return 'Unknown';
  const labels = ['Very Easy', 'Easy', 'Medium', 'Hard', 'Very Hard'];
  return labels[level - 1] || 'Unknown';
};

export const getDifficultyColor = (level?: number): string => {
  if (!level) return 'gray';
  const colors = ['green', 'lime', 'yellow', 'orange', 'red'];
  return colors[level - 1] || 'gray';
};

// Export default for easier imports
export default TransponderAPI;
