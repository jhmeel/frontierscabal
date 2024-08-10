import React from "react";
import { useEffect } from "react";
import NewEvent from "./NewEvent";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getEventDetails, clearErrors } from "../../actions/event";
import SpinLoader from "../../components/loaders/SpinLoader";
import { isOnline } from "../../utils";
import toast from "react-hot-toast";
import { RootState } from "../../store";

const UpdateEventPage = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const { loading, error, event } = useSelector((state:RootState) => state.eventDetails);
  const {
    loading: updateLoading,
    message: updateMessage,
    error: updateError,
  } = useSelector((state:RootState) => state.eventUpdate);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch<any>(clearErrors());
    }
    isOnline() && dispatch<any>(getEventDetails(params?.slug));
  }, [dispatch, toast, error]);
  
 
  return (
    <>
      {updateLoading && <SpinLoader />}
      <NewEvent
        eveId={event?._id}
        eveTitle={event?.title}
        eveDescription={event?.description}
        eveAvenue={event?.avenue}
        eveAvatar={event?.avatar?.url}
        eveCategory={event?.category}
        eveStartDate={event?.startDate}
        eveEndDate={event?.endDate}
        slug={event?.slug}
        action="Update"
      />
    </>
  );
};

export default UpdateEventPage;
