// Define the type for filter options response
export interface FilterOptionsResponse {
  success: boolean;
  data: {
    categories: string[];
    levels: string[];
    tags: string[];
  };
}

// Define the type for filter options in the composable
export interface FilterOptions {
  categories: string[];
  levels: string[];
  tags: string[];
}