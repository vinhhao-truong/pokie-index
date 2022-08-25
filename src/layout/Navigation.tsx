import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

import { MdCatchingPokemon } from "react-icons/md";

import { Container } from "react-bootstrap";
import {
  Menu,
  Button,
  Dropdown,
  Breadcrumb,
  Input,
  AutoComplete,
  Drawer,
} from "antd";
import type { SelectProps } from "antd/es/select";
import type { MenuProps } from "antd/es/menu";
import { motion } from "framer-motion";

import { capitalizeFirst, capitalizeFirstEach } from "../fns/capitalizeFirst";
import { useDispatch, useSelector } from "react-redux";
import {
  selectGlobalComps,
  setSearchContent,
} from "../store/globalComps-slice";

const NavMenu: React.FC<{ className?: string }> = (props) => {
  type MenuItem = Required<MenuProps>["items"][number];

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const getItem = (
    label: React.ReactNode,
    key?: React.Key | null,
    icon?: React.ReactNode,
    children?: MenuItem[]
  ): MenuItem => {
    return {
      key,
      icon,
      children,
      label,
    } as MenuItem;
  };

  const handleToggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleItemClicked: MenuProps["onClick"] = (e) => {
    navigate(e.key);
    setIsDrawerOpen(false);
  };

  const items: MenuItem[] = [
    getItem("Pokemon", "/pokemon?page=1&limit=20", <MdCatchingPokemon />),
    // getItem("Ability (Beta)", "/ability", <MdCatchingPokemon />),
  ];

  const classes: string | null = props.className ? props.className : "";

  const MenuRendered = () => (
    <Menu
      ref={menuRef}
      style={{ width: "100%" }}
      onClick={handleItemClicked}
      className="NavMenu__menu"
      // defaultSelectedKeys={["1"]}
      // defaultOpenKeys={["sub1"]}
      mode="vertical"
      items={items}
    />
  );

  const CurrentBreadcrumb = () => {
    //Make sure always contain every path (existed)
    const pathnameSlittedArr: string[] = location.pathname.split("/").slice(1);
    let breadcrumbPathList: string[] = [];
    for (let i = 0; i < pathnameSlittedArr.length; i++) {
      if (breadcrumbPathList.length === 0) {
        breadcrumbPathList.push(`/${pathnameSlittedArr[i]}`);
      } else {
        breadcrumbPathList.push(
          `${breadcrumbPathList[i - 1]}/${pathnameSlittedArr[i]}`
        );
      }
    }
    return (
      <>
        {
          //Because of landing being redirect to "/pokemon" making the array.length === 0
          location.pathname !== "/" && (
            <Breadcrumb className="mx-2">
              {pathnameSlittedArr.map((path, idx) => {
                //The latest one is not Link tag
                if (idx + 1 === pathnameSlittedArr.length) {
                  return (
                    <Breadcrumb.Item key={idx}>
                      {capitalizeFirstEach(path, "-")} /
                    </Breadcrumb.Item>
                  );
                }
                //Link url
                return (
                  <Breadcrumb.Item key={idx}>
                    <Link to="..">{capitalizeFirst(path)}</Link>
                  </Breadcrumb.Item>
                );
              })}
            </Breadcrumb>
          )
        }
      </>
    );
  };

  return (
    <div className={`NavMenu ${classes} d-flex align-items-center`}>
      <Button
        ref={btnRef}
        style={{ width: "fit-content" }}
        shape="circle"
        onClick={handleToggleDrawer}
      >
        {<MdCatchingPokemon />}
      </Button>
      <Drawer
        width={250}
        title="Pokiemon"
        placement="left"
        onClose={handleToggleDrawer}
        visible={isDrawerOpen}
        destroyOnClose
        closable={false}
        bodyStyle={{
          padding: 0,
        }}
        headerStyle={{
          padding: "10px 16px",
        }}
      >
        <MenuRendered />
      </Drawer>
      <CurrentBreadcrumb />
    </div>
  );
};

const SearchInput: React.FC<{ className?: string }> = (props) => {
  const [options, setOptions] = useState<SelectProps<object>["options"]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const searchContent = useSelector(selectGlobalComps).searchContent;

  const searchResult = (value: string) => [
    {
      label: `Search "${value}"?`,
      value: value,
    },
  ];

  const handleSearch = (value: string) => {
    dispatch(setSearchContent(value));

    if (!value) {
      navigate("/pokemon?page=1&limit=20");
      return;
    }
    navigate(`/pokemon?search=${value}`);
  };

  return (
    <AutoComplete
      dropdownMatchSelectWidth={250}
      style={{ width: 250 }}
      options={options}
      onSearch={handleSearch}
      value={searchContent}
    >
      <Input.Search
        value={searchContent}
        size="middle"
        placeholder="Search on Pokie"
        enterButton
      />
    </AutoComplete>
  );
};

const Navigation: React.FC<{ className?: string }> = (props) => {
  const classes: string | null = props.className ? props.className : "";

  return (
    <header
      style={{ zIndex: 1, borderBottom: "#f8f9fa 3px solid" }}
      className={`Navigation position-sticky top-0 py-1 bg-white d-flex justify-content-between align-items-center border-bottom-3 ${classes}`}
    >
      <NavMenu />
      <SearchInput />
    </header>
  );
};

export default Navigation;
