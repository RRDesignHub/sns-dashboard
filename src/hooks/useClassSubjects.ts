import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useAxiosSecure } from "./useAxiosSecure";

export const useClassSubjects = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch all subjects
  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/api/subjects/all-subjects");
      return data.data || [];
    },
  });

  // Fetch class configurations
  const { data: classConfigs = [] } = useQuery({
    queryKey: ["class-subjects"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/api/subjects/classes/all");
      return data.data || [];
    },
  });

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (config: any) => {
      const { data } = await axiosSecure.post(
        "/api/subjects/classes/assign",
        config,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-subjects"] });
      Swal.fire("সফল!", "ক্লাসের বিষয় নির্ধারণ করা হয়েছে", "success");
    },
    onError: (error: any) => {
      Swal.fire(
        "ত্রুটি!",
        error.response?.data?.message || "সংরক্ষণ করতে ব্যর্থ হয়েছে",
        "error",
      );
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axiosSecure.delete(`/api/subjects/classes/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-subjects"] });
      Swal.fire("সফল!", "ক্লাসের বিষয় মুছে ফেলা হয়েছে", "success");
    },
    onError: (error: any) => {
      Swal.fire(
        "ত্রুটি!",
        error.response?.data?.message || "মুছতে ব্যর্থ হয়েছে",
        "error",
      );
    },
  });

  return { subjects, classConfigs, saveMutation, deleteMutation };
};
