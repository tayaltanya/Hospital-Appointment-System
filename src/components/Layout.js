import React from "react";
import "../styles/LayoutStyles.css";
import { adminMenu, userMenu } from "./../Data/data";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge, message } from "antd";

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.clear();
    message.success("Logout Successfully");
    navigate("/login");
  };

  // ================= DOCTOR MENU =================
  const doctorMenu = [
    {
      name: "Home",
      path: "/",
      icon: "fa-solid fa-house",
    },
    {
      name: "Appointments",
      path: "/doctor-appointments",
      icon: "fa-solid fa-list",
    },
    {
      name: "Profile",
      path: `/doctor/profile/${user?._id}`,
      icon: "fa-solid fa-user",
    },
  ];

  // ================= MENU SELECT =================
  const SidebarMenu = user?.isAdmin
    ? adminMenu
    : user?.isDoctor
    ? doctorMenu
    : userMenu;

  return (
    <div className="main">
      <div className="layout">

        {/* ================= SIDEBAR ================= */}
        <div className="sidebar">
          <div className="logo">
            <h6 className="text-light">DOC APP</h6>
            <hr />
          </div>

          <div className="menu">
            {SidebarMenu.map((menu, index) => {
              const isActive =
                location.pathname === menu.path ||
                location.pathname.includes(menu.path);

              return (
                <div
                  key={index}
                  className={`menu-item ${isActive ? "active" : ""}`}
                >
                  <i className={menu.icon}></i>
                  <Link to={menu.path}>{menu.name}</Link>
                </div>
              );
            })}

            {/* ================= LOGOUT ================= */}
            <div
              className="menu-item"
              onClick={handleLogout}
              style={{ cursor: "pointer" }}
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>Logout</span>
            </div>
          </div>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="content">

          {/* HEADER */}
          <div className="header">
            <div className="header-content">

              {/* NOTIFICATION */}
              <Badge
                count={user?.notification?.length || 0}
                onClick={() => navigate("/notification")}
                style={{ cursor: "pointer" }}
              >
                <i className="fa-solid fa-bell"></i>
              </Badge>

              {/* USER PROFILE LINK */}
              {user?.isDoctor ? (
                <Link to={`/doctor/profile/${user?._id}`}>
                  {user?.name}
                </Link>
              ) : (
                <Link to="/">{user?.name}</Link>
              )}

            </div>
          </div>

          {/* PAGE CONTENT */}
          <div className="body">{children}</div>

        </div>
      </div>
    </div>
  );
};

export default Layout;