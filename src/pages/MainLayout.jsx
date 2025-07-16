import Dashboard from "../components/Dashboard";
import Chatroom from "../components/Chatroom";

function MainLayout() {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Dashboard />
      <Chatroom />
    </div>
  );
}

export default MainLayout;
