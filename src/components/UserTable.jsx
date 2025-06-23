import React from "react";

// Função para definir o status (aqui todos são "active", personalize se quiser)
const getStatus = (user) => {
  return "active"; // ou implemente sua regra, ex: user.role === "admin" ? "active" : "inactive"
};

const statusColor = {
  active: "green",
  inactive: "red",
};

export default function UserTable({ users }) {
  // Insere o campo status nos usuários
  const usersWithStatus = users.map((user) => ({
    ...user,
    status: getStatus(user),
  }));

  return (
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Email</th>
          <th>Perfil</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {usersWithStatus.map((user) => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>
              <span
                style={{
                  display: "inline-block",
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: statusColor[user.status],
                  marginRight: 8,
                  verticalAlign: "middle",
                }}
              ></span>
              {user.status === "active" ? "Ativo" : "Inativo"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}