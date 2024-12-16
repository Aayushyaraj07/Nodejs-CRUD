import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Navbar from "./Navbar";
import ProjectCard from "./ProjectCard";
import "./styles/Dashboard.scss";
import api from "../../api/axios";


interface Project {
  id: number;
  title: string;
  productImage: string[];
  price: number;
  shortDescription: string;
  description: string;
  category: string[]; // Support multiple categories
}

const Dashboard: React.FC = () => {
  const [name, setName] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form] = Form.useForm();
  const token = sessionStorage.getItem("token");

  const fetchProjects = async () => {
    try {
      const userName = sessionStorage.getItem("name");
      const userId = sessionStorage.getItem("userId");
      const token = sessionStorage.getItem("token");

      setName(userName);

      if (!userId || !token) {
        setError("Authorization failed. Please log in again.");
        setLoading(false);
        return;
      }

      const response = await api.get(`/projects/userId/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = response.data;

      if (
        responseData?.status === "success" &&
        Array.isArray(responseData.data)
      ) {
        setProjects(responseData.data);
        setFilteredProjects(responseData.data);
      } else {
        setError("Failed to load projects.");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to fetch projects. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredProjects(
      projects.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          project.shortDescription.toLowerCase().includes(query)
      )
    );
  };

  const handleAddProduct = () => {
    setEditingProject(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleEditProduct = (project: Project) => {
    setEditingProject(project);
    setIsModalVisible(true);
    form.setFieldsValue({
      ...project,
      productImage: project.productImage[0], // Set first image in the form
    });
  };

  const handleDeleteProduct = async (projectId: number) => {
    try {
      await api.delete(`/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProjects(projects.filter((project) => project.id !== projectId));
      setFilteredProjects(
        filteredProjects.filter((project) => project.id !== projectId)
      );
    } catch (error) {
      console.error("Error deleting project:", error);
      setError("Failed to delete the project. Please try again.");
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleFormSubmit = async (values: Partial<Project>) => {
    try {
      // Ensure imageUrl is wrapped in an array
      const payload = {
        ...values,
        productImage: [values.productImage], // Wrap image URL in an array
        category: [values.category], // Wrap image URL in an array
      };

      if (editingProject) {
        // Editing an existing project
        const response = await api.patch(
          `/projects/${editingProject.id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response?.status === 200) {
          const updatedProject = response.data;

          setProjects(
            projects.map((project) =>
              project.id === editingProject.id ? updatedProject : project
            )
          );
          setFilteredProjects(
            filteredProjects.map((project) =>
              project.id === editingProject.id ? updatedProject : project
            )
          );
          fetchProjects();
        }
      } else {
        // Adding a new project
        const response = await api.post("/projects", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response?.status === 201) {
          const newProject = response.data;

          setProjects([...projects, newProject]);
          setFilteredProjects([...filteredProjects, newProject]);

        }
      }
      setIsModalVisible(false);
      fetchProjects();
      form.resetFields();
    } catch (error) {
      console.error("Error saving project:", error);
      setError("Failed to save the project. Please try again.");
    }
  };

  return (
    <div className="dashboard">
      <Navbar userName={name} />
      <div className="dashboard-header">
        <Input
          placeholder="Search projects..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddProduct}
        >
          Add Product
        </Button>
      </div>
      <div className="dashboard-content">
        {loading && <p>Loading projects...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && !error && filteredProjects.length === 0 && (
          <p>No projects available to display.</p>
        )}
        {!loading &&
          !error &&
          filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              {...project}
              onEdit={() => handleEditProduct(project)}
              onDelete={() => handleDeleteProduct(project.id)}
            />
          ))}
      </div>

      <Modal
        title={editingProject ? "Edit Product" : "Add Product"}
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter the title" }]}
          >
            <Input placeholder="Enter title" />
          </Form.Item>
          <Form.Item
            label="Short Description"
            name="shortDescription"
            rules={[
              { required: true, message: "Please enter a short description" },
            ]}
          >
            <Input placeholder="Enter short description" />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please enter the price" }]}
          >
            <Input type="number" placeholder="Enter price" />
          </Form.Item>
          <Form.Item
            label="Image URL"
            name="productImage"
            rules={[{ required: true, message: "Please enter the image URL" }]}
          >
            <Input placeholder="Enter image URL" />
          </Form.Item>
          <Form.Item
            label="Category"
            name="category"
            rules={[
              {
                required: true,
                message: "Please select at least one category",
              },
            ]}
          >
            <Select
              placeholder="Select categories"
              options={[
                { label: "Electronics", value: "electronics" },
                { label: "Books", value: "books" },
                { label: "Fashion", value: "fashion" },
                { label: "Toys", value: "toys" },
              ]}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            {editingProject ? "Update Product" : "Add Product"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Dashboard;
