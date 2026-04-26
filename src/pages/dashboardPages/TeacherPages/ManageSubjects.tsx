import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaBook,
  FaSearch,
} from "react-icons/fa";
import { useAxiosSecure } from "../../../hooks/useAxiosSecure";
import styles from "../../../styles/DashboardPages/ManageSub.module.scss";
import Swal from "sweetalert2";
import type { Subject } from "../../../types/loginTypes/subjectTypes";

const ManageSubjects: React.FC = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<Subject>({
    name: "",
    nameBn: "",
    code: "",
    totalMarks: 100,
    academicMarks: 80,
    behavioralMarks: 20,
    status: "active",
  });

  // Fetch all subjects
  const { data: subjects = [], isLoading } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/api/subjects/all-subjects");
      return data.data || [];
    },
  });

  // Create subject mutation
  const createMutation = useMutation({
    mutationFn: async (newSubject: Subject) => {
      const { data } = await axiosSecure.post(
        "/api/subjects/create",
        newSubject,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      closeModal();
      Swal.fire("সফল!", "বিষয়টি তৈরি করা হয়েছে", "success");
    },
  });

  // Update subject mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, subject }: { id: string; subject: Subject }) => {
      const { data } = await axiosSecure.put(
        `/api/subjects/update/${id}`,
        subject,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      closeModal();
      Swal.fire("সফল!", "বিষয়টি হালনাগাদ করা হয়েছে", "success");
    },
  });

  // Delete subject mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axiosSecure.delete(`/api/subjects/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      Swal.fire("সফল!", "বিষয়টি মুছে ফেলা হয়েছে", "success");
    },
  });

  const handleTotalMarksChange = (marks: 50 | 100) => {
    if (marks === 100) {
      setFormData({
        ...formData,
        totalMarks: 100,
        academicMarks: 80,
        behavioralMarks: 20,
      });
    } else {
      setFormData({
        ...formData,
        totalMarks: 50,
        academicMarks: 50,
        behavioralMarks: 0,
      });
    }
  };

  const openModal = (subject?: Subject) => {
    if (subject) {
      setEditingSubject(subject);
      setFormData(subject);
    } else {
      setEditingSubject(null);
      setFormData({
        name: "",
        nameBn: "",
        code: "",
        totalMarks: 100,
        academicMarks: 80,
        behavioralMarks: 20,
        status: "active",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSubject(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSubject) {
      updateMutation.mutate({ id: editingSubject._id!, subject: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (subject: Subject) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: `${subject.name} বিষয়টি মুছে ফেলা হবে!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#16a34a",
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন",
      cancelButtonText: "বাতিল করুন",
    }).then((result) => {
      if (result.isConfirmed && subject._id) {
        deleteMutation.mutate(subject._id);
      }
    });
  };

  const filteredSubjects = subjects.filter(
    (subject: Subject) =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.nameBn.includes(searchTerm) ||
      subject.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading) return <div className={styles.loading}>লোড হচ্ছে...</div>;

  return (
    <div className={styles.manageSubjects}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <FaBook />
          </div>
          <div>
            <h1 className={styles.pageTitle}>বিষয় ব্যবস্থাপনা</h1>
            <p className={styles.pageSubtitle}>
              সাধারণ বিষয় তালিকা তৈরি ও ব্যবস্থাপনা করুন। এখানে যুক্ত করা
              বিষয়গুলো পরবর্তীতে ক্লাসভিত্তিক নির্ধারণ করা যাবে।
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="বিষয়ের নাম বা কোড অনুসন্ধান..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <button className={styles.addButton} onClick={() => openModal()}>
          <FaPlus />
          <span>নতুন বিষয় যোগ করুন</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{subjects.length}</div>
          <div className={styles.statLabel}>মোট বিষয়</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>
            {subjects.filter((s: Subject) => s.totalMarks === 100).length}
          </div>
          <div className={styles.statLabel}>১০০ মার্কের বিষয়</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>
            {subjects.filter((s: Subject) => s.totalMarks === 50).length}
          </div>
          <div className={styles.statLabel}>৫০ মার্কের বিষয়</div>
        </div>
      </div>

      {/* Subjects Table */}
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h3 className={styles.tableTitle}>বিষয় তালিকা</h3>
          <span className={styles.tableCount}>
            {filteredSubjects.length} টি বিষয়
          </span>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.subjectTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>বিষয়ের নাম (বাংলা)</th>
                <th>বিষয়ের নাম (ইংরেজি)</th>
                <th>কোড</th>
                <th>মোট মার্ক</th>
                <th>একাডেমিক</th>
                <th>বিহেভিওরাল</th>
                <th>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.map((subject: Subject, idx: number) => (
                <tr key={subject._id} className={styles.subjectRow}>
                  <td className={styles.slNo}>{idx + 1}</td>
                  <td className={styles.nameBn}>{subject.nameBn}</td>
                  <td className={styles.nameEn}>{subject.name}</td>
                  <td className={styles.code}>{subject.code}</td>
                  <td className={styles.marks}>
                    <span
                      className={`${styles.marksBadge} ${subject.totalMarks === 100 ? styles.marks100 : styles.marks50}`}
                    >
                      {subject.totalMarks}
                    </span>
                  </td>
                  <td>{subject.academicMarks}</td>
                  <td>{subject.behavioralMarks}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.editBtn}
                        onClick={() => openModal(subject)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(subject)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSubjects.length === 0 && (
                <tr>
                  <td colSpan={8} className={styles.noData}>
                    <FaBook />
                    <p>কোন বিষয় পাওয়া যায়নি</p>
                    <button
                      onClick={() => openModal()}
                      className={styles.noDataBtn}
                    >
                      নতুন বিষয় যোগ করুন
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{editingSubject ? "বিষয় সম্পাদনা" : "নতুন বিষয় তৈরি"}</h3>
              <button className={styles.closeBtn} onClick={closeModal}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>
                  বিষয়ের নাম (বাংলা) <span>*</span>
                </label>
                <input
                  type="text"
                  value={formData.nameBn}
                  onChange={(e) =>
                    setFormData({ ...formData, nameBn: e.target.value })
                  }
                  placeholder="যেমন: বাংলা ১ম পত্র"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>
                  বিষয়ের নাম (ইংরেজি) <span>*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="যেমন: Bangla 1st Paper"
                  required
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>
                    বিষয় কোড <span>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        code: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="যেমন: BAN-101"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>
                    মোট মার্ক <span>*</span>
                  </label>
                  <div className={styles.radioGroup}>
                    <label>
                      <input
                        type="radio"
                        value="100"
                        checked={formData.totalMarks === 100}
                        onChange={() => handleTotalMarksChange(100)}
                      />
                      <span>১০০</span>
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="50"
                        checked={formData.totalMarks === 50}
                        onChange={() => handleTotalMarksChange(50)}
                      />
                      <span>৫০</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>একাডেমিক মার্ক</label>
                  <input
                    type="number"
                    value={formData.academicMarks}
                    readOnly
                    className={styles.readonlyInput}
                  />
                  <small>স্বয়ংক্রিয়ভাবে নির্ধারিত</small>
                </div>
                <div className={styles.formGroup}>
                  <label>বিহেভিওরাল মার্ক</label>
                  <input
                    type="number"
                    value={formData.behavioralMarks}
                    readOnly
                    className={styles.readonlyInput}
                  />
                  <small>স্বয়ংক্রিয়ভাবে নির্ধারিত</small>
                </div>
              </div>
              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={closeModal}
                >
                  বাতিল করুন
                </button>
                <button type="submit" className={styles.submitBtn}>
                  <FaSave />
                  {editingSubject ? "আপডেট করুন" : "সংরক্ষণ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSubjects;
