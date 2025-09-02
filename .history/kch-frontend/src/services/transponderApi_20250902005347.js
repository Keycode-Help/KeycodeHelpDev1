// Transponder Database API Service
import { supabase } from "./supabaseClient";

class TransponderAPI {
  /**
   * Get all vehicle makes with statistics
   */
  static async getVehicleMakes() {
    try {
      const { data, error } = await supabase
        .from("vehicle_summary")
        .select("*")
        .order("total_models", { ascending: false });

      if (error) {
        console.error("Error fetching vehicle makes:", error);
        throw new Error(error.message);
      }

      // Transform data to match frontend expectations
      return data.map((make) => ({
        id: make.id,
        name: make.make_name,
        normalizedName: make.make_name_normalized,
        totalModels: make.total_models,
        verifiedModels: make.verified_models,
        earliestYear: make.earliest_year,
        latestYear: make.latest_year,
      }));
    } catch (error) {
      console.error("Get vehicle makes error:", error);
      throw error;
    }
  }

  /**
   * Get models for a specific make
   */
  static async getModelsForMake(makeId) {
    try {
      // First get the make name from the makes list
      const makesData = await this.getVehicleMakes();
      const make = makesData.find((m) => m.id === makeId);

      if (!make) {
        console.warn("Make not found:", makeId);
        return [];
      }

      // Get all models for this make from transponder_data
      const { data, error } = await supabase
        .from("transponder_data")
        .select("model")
        .eq("make", make.name)
        .order("model");

      if (error) {
        console.error("Error fetching models for make:", error);
        throw new Error(error.message);
      }

      // Extract unique model names and create ID-based structure
      const uniqueModels = [...new Set(data?.map((item) => item.model) || [])];
      return uniqueModels.map((model, index) => ({
        id: `${makeId}_${index}`,
        name: model,
      }));
    } catch (error) {
      console.error("Get models for make error:", error);
      throw error;
    }
  }

  /**
   * Get all system types
   */
  static async getSystemTypes() {
    try {
      const { data, error } = await supabase
        .from("system_types")
        .select("*")
        .eq("is_active", true)
        .order("system_name");

      if (error) {
        console.error("Error fetching system types:", error);
        throw new Error(error.message);
      }

      return data.map((type) => ({
        id: type.id,
        name: type.system_name,
        code: type.system_code,
        description: type.system_description,
      }));
    } catch (error) {
      console.error("Get system types error:", error);
      throw error;
    }
  }

  /**
   * Get all transponder families
   */
  static async getTransponderFamilies() {
    try {
      const { data, error } = await supabase
        .from("transponder_family_summary")
        .select("*")
        .order("usage_count", { ascending: false });

      if (error) {
        console.error("Error fetching transponder families:", error);
        throw new Error(error.message);
      }

      return data.map((family) => ({
        id: family.id,
        name: family.family_name,
        code: family.family_code,
        usageCount: family.usage_count,
        makeCount: family.make_count,
      }));
    } catch (error) {
      console.error("Get transponder families error:", error);
      throw error;
    }
  }

  /**
   * Search transponder entries with enhanced functionality
   */
  static async searchEntries({
    makeId = null,
    modelId = null,
    yearFrom = null,
    yearTo = null,
    systemTypeId = null,
    transponderFamilyId = null,
    searchTerm = null,
    page = 0,
    pageSize = 20,
  } = {}) {
    try {
      console.log("🔍 Search Parameters:", {
        makeId,
        modelId,
        yearFrom,
        yearTo,
        systemTypeId,
        transponderFamilyId,
        searchTerm,
        page,
        pageSize,
      });

      // Use enhanced search function if available, fallback to direct query
      let data, count, error;

      // Convert filter IDs to names for the enhanced search
      let makeName = null;
      let modelName = null;
      let systemTypeName = null;
      let transponderFamilyName = null;

      if (makeId) {
        const makeData = await this.getVehicleMakes();
        const make = makeData.find(
          (m) => m.id === makeId || m.normalizedName === makeId
        );
        makeName = make ? make.name : null;
        console.log("🔍 Make Name:", makeName);
      }

      if (modelId && typeof modelId === "string" && modelId.includes("_")) {
        modelName = modelId.split("_").slice(1).join("_");
        console.log("🔍 Model Name:", modelName);
      }

      if (systemTypeId) {
        const systemTypes = await this.getSystemTypes();
        const systemType = systemTypes.find((s) => s.id === systemTypeId);
        systemTypeName = systemType ? systemType.name : null;
        console.log("🔍 System Type Name:", systemTypeName);
      }

      if (transponderFamilyId) {
        const families = await this.getTransponderFamilies();
        const family = families.find((f) => f.id === transponderFamilyId);
        transponderFamilyName = family ? family.name : null;
        console.log("🔍 Transponder Family Name:", transponderFamilyName);
      }

      // Determine which year to use for search
      const searchYear = yearFrom || yearTo || null;
      console.log("🔍 Search Year:", searchYear);

      try {
        console.log("🔍 Attempting search...");

        // Use direct query on transponder_data table
        let query = supabase
          .from("transponder_data")
          .select("*", { count: "exact" });

        // Apply filters - adjust column names based on transponder_data structure
        if (makeName) {
          query = query.eq("make", makeName);
        }

        if (modelName) {
          query = query.eq("model", modelName);
        }

        if (yearFrom) {
          query = query.or(`year_from.lte.${yearFrom},year_from.is.null`);
        }

        if (yearTo) {
          query = query.or(`year_to.gte.${yearTo},year_to.is.null`);
        }

        if (systemTypeName) {
          query = query.eq("system_type", systemTypeName);
        }

        if (transponderFamilyName) {
          query = query.eq("transponder_family", transponderFamilyName);
        }

        // Apply search term
        if (searchTerm && searchTerm.trim()) {
          const term = searchTerm.trim();
          query = query.or(
            `make.ilike.%${term}%,model.ilike.%${term}%,transponder_family.ilike.%${term}%,transponder_detail.ilike.%${term}%,oem_keys.ilike.%${term}%`
          );
        }

        // Apply pagination
        const from = page * pageSize;
        const to = from + pageSize - 1;

        query = query
          .order("make")
          .order("model")
          .order("year_from", { ascending: false, nullsLast: true })
          .range(from, to);

        console.log("🔍 Executing search query...");
        const result = await query;
        data = result.data;
        count = result.count;
        error = result.error;

        console.log("📊 Search query results:", {
          dataCount: data?.length || 0,
          totalCount: count,
          error: error,
        });
      } catch (searchError) {
        console.error("❌ Error searching entries:", searchError);
        throw new Error(searchError.message);
      }

      if (error) {
        console.error("❌ Error searching entries:", error);
        throw new Error(error.message);
      }

      console.log("📊 Raw data before transformation:", {
        dataCount: data?.length || 0,
        totalCount: count,
        pageSize,
        page,
      });

      // Transform data to match frontend expectations
      const transformedData = data.map((entry) => ({
        id: entry.id,
        vehicleRange: {
          yearFrom: entry.year_from,
          yearTo: entry.year_to,
          yearNote: entry.year_display,
          model: {
            id: `model_${entry.model}`,
            name: entry.model,
            make: {
              id: `make_${entry.make}`,
              name: entry.make,
            },
          },
        },
        systemType: entry.system_type
          ? {
              id: `system_${entry.system_type}`,
              name: entry.system_type,
            }
          : null,
        transponderFamily: entry.transponder_family
          ? {
              id: `family_${entry.transponder_family}`,
              name: entry.transponder_family,
            }
          : null,
        transponderDetail: entry.transponder_detail
          ? {
              detail: entry.transponder_detail,
            }
          : null,
        crossRefs: entry.cross_refs
          ? entry.cross_refs.split(",").map((ref, index) => ({
              id: `ref_${index}`,
              label: ref.trim(),
            }))
          : [],
        oemKeys: entry.oem_keys
          ? entry.oem_keys.split(",").map((key, index) => ({
              id: `key_${index}`,
              code: key.trim(),
            }))
          : [],
        notes: [], // Could be populated from notes field if needed
        difficultyLevel: entry.difficulty_level,
        createdAt: entry.created_at,
        updatedAt: entry.updated_at,
      }));

      // Calculate pagination info
      const totalElements = count || 0;
      const totalPages = Math.ceil(totalElements / pageSize);

      console.log("📊 Final pagination calculation:", {
        totalElements,
        totalPages,
        pageSize,
        currentPage: page,
        hasNext: page < totalPages - 1,
        hasPrevious: page > 0,
      });

      return {
        content: transformedData,
        currentPage: page,
        totalPages,
        totalElements,
        pageSize,
        hasNext: page < totalPages - 1,
        hasPrevious: page > 0,
      };
    } catch (error) {
      console.error("Search entries error:", error);
      throw error;
    }
  }

  /**
   * Get search suggestions for autocomplete
   */
  static async getSearchSuggestions(searchTerm, limit = 10) {
    try {
      if (!searchTerm || searchTerm.trim().length < 2) {
        return [];
      }

      const term = searchTerm.trim();

      // Get suggestions from transponder_data table
      const { data, error } = await supabase
        .from("transponder_data")
        .select("make, model, transponder_family")
        .or(
          `make.ilike.%${term}%,model.ilike.%${term}%,transponder_family.ilike.%${term}%`
        )
        .limit(limit);

      if (error) {
        console.error("Error fetching search suggestions:", error);
        return [];
      }

      // Transform data into suggestion format
      const suggestions = [];

      // Add make suggestions
      const makes = [
        ...new Set(data?.map((item) => item.make).filter(Boolean) || []),
      ];
      makes.forEach((make) => {
        suggestions.push({
          suggestion: make,
          suggestion_type: "make",
          count: data.filter((item) => item.make === make).length,
        });
      });

      // Add model suggestions
      const models = [
        ...new Set(data?.map((item) => item.model).filter(Boolean) || []),
      ];
      models.forEach((model) => {
        suggestions.push({
          suggestion: model,
          suggestion_type: "model",
          count: data.filter((item) => item.model === model).length,
        });
      });

      // Add transponder family suggestions
      const families = [
        ...new Set(
          data?.map((item) => item.transponder_family).filter(Boolean) || []
        ),
      ];
      families.forEach((family) => {
        suggestions.push({
          suggestion: family,
          suggestion_type: "transponder",
          count: data.filter((item) => item.transponder_family === family)
            .length,
        });
      });

      // Sort by relevance (count) and limit results
      return suggestions.sort((a, b) => b.count - a.count).slice(0, limit);
    } catch (error) {
      console.error("Get search suggestions error:", error);
      return [];
    }
  }

  /**
   * Get popular search terms
   */
  static async getPopularSearches() {
    try {
      // Get popular searches from transponder_data table
      const { data, error } = await supabase
        .from("transponder_data")
        .select("make, model, transponder_family")
        .limit(10);

      if (error) {
        console.error("Error fetching popular searches:", error);
        return [];
      }

      // Create popular search suggestions
      const popularSearches = [];

      // Add some popular makes
      const makes = [
        ...new Set(data?.map((item) => item.make).filter(Boolean) || []),
      ];
      makes.slice(0, 5).forEach((make) => {
        popularSearches.push({
          search_term: make,
          count: data.filter((item) => item.make === make).length,
        });
      });

      // Add some popular models
      const models = [
        ...new Set(data?.map((item) => item.model).filter(Boolean) || []),
      ];
      models.slice(0, 3).forEach((model) => {
        popularSearches.push({
          search_term: model,
          count: data.filter((item) => item.model === model).length,
        });
      });

      return popularSearches;
    } catch (error) {
      console.error("Get popular searches error:", error);
      return [];
    }
  }

  /**
   * Get database statistics for dashboard
   */
  static async getDatabaseStats() {
    try {
      // Get total entries
      const { count: totalEntries } = await supabase
        .from("transponder_entries")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);

      // Get total makes
      const { count: totalMakes } = await supabase
        .from("vehicle_makes")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);

      // Get total families
      const { count: totalFamilies } = await supabase
        .from("transponder_families")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);

      return {
        totalEntries: totalEntries || 0,
        totalMakes: totalMakes || 0,
        totalFamilies: totalFamilies || 0,
      };
    } catch (error) {
      console.error("Get database stats error:", error);
      throw error;
    }
  }
}

export default TransponderAPI;
