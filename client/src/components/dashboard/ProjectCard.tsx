import React from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "./styles/Dashboard.scss";

interface ProjectCardProps {
  title: string;
  productImage: string[]; // Ensure this is an array
  price: number;
  shortDescription: string;
  category: string[];
  onEdit: () => void;
  onDelete: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  productImage,
  price,
  shortDescription,
  category,
  onEdit,
  onDelete,
}) => {
  // Check if productImage is an array and has at least one image
  const imageSrc = Array.isArray(productImage) && productImage.length > 0 ? productImage[0] : "/path/to/default/image.jpg"; // Fallback to a default image if none exists
  const categorytag = Array.isArray(category) && category.length > 0 ? category[0] : "Appliances"; // Fallback to a default image if none exists

  return (
    <div className="project-card">
      <div className="category-badge">{categorytag}</div>
      <img
        src={imageSrc}
        alt={title}
        className="project-card-image"
      />
      <h2>{title}</h2>
      <p>{shortDescription}</p>
      <span>${price}</span>
      <div className="project-card-footer">
        <EditOutlined onClick={onEdit} className="edit-icon" />
        <DeleteOutlined onClick={onDelete} className="delete-icon" />
      </div>
    </div>
  );
};

export default ProjectCard;