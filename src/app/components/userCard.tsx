import { DefaultSession } from "next-auth";

export function UserCard({ user }: { user: DefaultSession["user"] }) {
  return (
    <div
      style={{
        height: "48px",
        padding: "0px 10px",
        lineHeight: "15px",
        fontSize: "15px",
      }}
    >
      <div>Current Logged In User</div>
      <div>{user?.name}</div>
      <div>{user?.email}</div>
    </div>
  );
}
