const API_BASE = "http://localhost:8000";

export const detectFaces = async (image, sectionId) => {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("section_id", sectionId);

  const res = await fetch(`${API_BASE}/detect`, {
    method: "POST",
    body: formData,
  });

  return res.json();
};

export const saveAttendance = async (data) => {
  const res = await fetch(`${API_BASE}/attendance/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};
