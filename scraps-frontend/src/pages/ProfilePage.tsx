import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "sonner";

const ProfilePage = () => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [phone, setPhone] = useState(storedUser.phone || "");
  const [name, setName] = useState(storedUser.name || "");
  const email = storedUser.email;
  const role = storedUser.role;

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8081/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error("Update failed");

      const updated = await res.json();

      localStorage.setItem("user", JSON.stringify(updated));

      toast.success("Profile updated successfully ✅");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <DashboardLayout role={role?.toLowerCase()}>
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>

        <div className="bg-card p-6 rounded-2xl border space-y-4">
          <div>
            <label>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-xl"
            />
          </div>

          <div>
            <label>Email</label>
            <input
              value={email}
              disabled
              className="w-full p-3 border rounded-xl bg-gray-100"
            />
          </div>
          <div>
  <label>WhatsApp Number</label>
  <input
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    className="w-full p-3 border rounded-xl"
  />
</div>
          <div>
            <label>Role</label>
            <input
              value={role}
              disabled
              className="w-full p-3 border rounded-xl bg-gray-100"
            />
          </div>

          <button
            onClick={handleUpdate}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold"
          >
            Update Profile
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;