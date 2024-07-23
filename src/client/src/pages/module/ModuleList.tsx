import React, { useEffect, useState } from "react";
import { ModuleItem } from "../../components/moduleItem/ModuleItem";
import styled from "styled-components";
import { useSnackbar } from "notistack";
import axiosInstance from "../../utils/axiosInstance";
import { IconVideoTwentyFour } from "../../assets/icons";
import Footer from "../../components/footer/Footer";
import ModuleItemSkeletonLoader from "../../components/loaders/ModuleItemSkeletonLoader";
import { isOnline } from "../../utils";
import { IModule } from "../../types";

const ModuleList: React.FC = (): React.ReactElement => {
  const { enqueueSnackbar } = useSnackbar();
  const [modules, setModules] = useState<Array<IModule>|null>(null);
  const [moduleErr, setModuleErr] = useState<any>(null);

  useEffect(() => {
    const getModule = async () => {
      try {
        const { data } = await axiosInstance().get(`/api/v1/modules`);
        setModules(data?.modules);
      } catch (err: any) {
        enqueueSnackbar(err.message, { variant: "error" });
        setModuleErr(err);
      }
    };

    isOnline() && getModule();
  }, [moduleErr]);
  return (
    <>
      <ModuleHeader>
        <IconVideoTwentyFour /> Modules
      </ModuleHeader>
      <ModuleRenderer>
        {modules?.length
          ? modules.map((mod: any, i: number) => (
              <ModuleItem
                key={i}
                _id={mod?._id}
                title={mod?.title}
                description={mod?.description}
                banner={mod?.avatar?.secureUrl}
              />
            ))
          : Array(10)
              .fill(null)
              .map((mod: any, i: number) => (
                <ModuleItemSkeletonLoader key={i} />
              ))}
      </ModuleRenderer>
      <Footer />
    </>
  );
};

export default ModuleList;
const ModuleHeader = styled.h2`
  width: 100%;
  margin: 0 auto;
  padding: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
  position: fixed;
  z-index: 9;
  background: transparent;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  -moz-backdrop-filter: blur(10px);
  -o-backdrop-filter: blur(10px);
  box-shadow: 0 0px 3px rgba(0, 0, 0, 0.2);
  transform: 0.5s;

  @media (max-width: 767px) {
    & {
      font-size: 16px;
    }
  }
`;
const ModuleRenderer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  position: relative;
  top: 45px;
  padding-bottom: 150px;
  align-items: center;
  justify-content: center;
  gap: 10px;

  @media (max-width: 767px) {
    & {
      padding-bottom: 100px;
      flex-direction: column;
    }
  }
`;
