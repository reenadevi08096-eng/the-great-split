 import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [yourName, setYourName] = useState("");
  const [memberName, setMemberName] = useState("");
  const [members, setMembers] = useState([]);

  const navigate = useNavigate();

  // =========================
  // ADD MEMBER
  // =========================

  const addMember = () => {
    const name = memberName.trim();

    if (name === "") {
      alert("Please enter member name");
      return;
    }

    if (members.includes(name)) {
      alert("This member is already added");
      return;
    }

    setMembers([...members, name]);
    setMemberName("");
  };

  // =========================
  // CREATE GROUP
  // =========================

  const createGroup = () => {
    const cleanGroupName = groupName.trim();
    const cleanYourName = yourName.trim();

    if (cleanGroupName === "") {
      alert("Please enter group name");
      return;
    }

    if (cleanYourName === "") {
      alert("Please enter your name");
      return;
    }

    if (members.length === 0) {
      alert("Please add at least one member");
      return;
    }

    // Make sure current user is also a member
    let finalMembers = [...members];

    if (!finalMembers.includes(cleanYourName)) {
      finalMembers.unshift(cleanYourName);
    }

    const group = {
      name: cleanGroupName,
      members: finalMembers,
      currentUser: cleanYourName,
    };

    // Save group
    localStorage.setItem(
      "group",
      JSON.stringify(group)
    );

    // New group = new expenses
    localStorage.removeItem("expenses");

    // New group = new settlements
    localStorage.removeItem("settlements");

    navigate("/dashboard");
  };

  return (
    <main>
      <section className="create-group">

        <h1>Create New Group</h1>

        {/* GROUP NAME */}

        <label>Group Name</label>

        <input
          type="text"
          placeholder="e.g. Goa Trip"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-400 rounded-md text-black bg-white focus:text-block"
          style={{ color: 'black', backgroundColor: 'white'}}
          
        />

        {/* YOUR NAME */}

        <label>Your Name</label>

        <input
          type="text"
          placeholder="e.g. Reena"
          value={yourName}
          onChange={(e) => setYourName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-400 rounded-md text-black bg-white focus:text-block"  
        style={{ color: 'black', backgroundColor: 'white'}}
        />

        {/* MEMBER NAME */}

        <label>Member Name</label>

        <input
          type="text"
          placeholder="Enter member name"
          value={memberName}
          onChange={(e) => setMemberName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-400 rounded-md text-black bg-white focus:text-block"
        style={{ color: 'black', backgroundColor: 'white'}}
        />

        <button type="button" onClick={addMember}>
          Add Member
        </button>

        {/* MEMBERS */}

        <h2>Members</h2>

        {members.length === 0 ? (
          <p>No members added yet.</p>
        ) : (
          <ul>
            {members.map((member, index) => (
              <li key={index}>
                {member}
              </li>
            ))}
          </ul>
        )}

        {/* CREATE GROUP */}

        <button type ="button" onClick={createGroup}>
          Create Group
        </button>

      </section>
    </main>
  );
}

export default CreateGroup;