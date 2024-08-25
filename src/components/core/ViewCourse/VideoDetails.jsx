import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI';
import { updateCompletedLectures } from '../../../slices/viewCourseSlice';
import {AiFillPlayCircle} from "react-icons/ai"
import { Player } from 'video-react';
import 'video-react/dist/video-react.css';
import IconBtn from '../../common/IconBtn';

const VideoDetails = () => {

  const {courseId, sectionId, subSectionId} = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const playerRef = useRef();
  const location = useLocation();
  const {token} = useSelector(state => state.auth);
  const {courseSectionData, courseEntireData, completedLectures, totalNoOfLectures} = useSelector(state => state.viewCourse);

  const [videoData, setVideoData] = useState([]);
  console.log("videoData",videoData)
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const setVideoSpecificDetails = async() =>{
      if(!courseSectionData.length)
        return;

      if(!courseId && !sectionId && !subSectionId){
        navigate("dashboard/enrolled-courses");
      }else{
        // let's assume that all 3 fields are present
        console.log("courseSectionData",courseSectionData)
        const filteredData = courseSectionData.filter((course) => course._id === sectionId);
        const filteredVideoData = filteredData?.[0].subSection.filter((data) => data._id === subSectionId);
        setVideoData(filteredVideoData[0]);
        setVideoEnded(false);
      }
    };
    setVideoSpecificDetails();
  }, [courseSectionData, courseEntireData, location.pathname]);


  const isFirstVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);
    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((data) => data._id === subSectionId);
    if(currentSectionIndex === 0 && currentSubSectionIndex === 0){
      return true;
    }else{
      return false;
    }
  };
  
  const isLastVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);
    const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length;
    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((data) => data._id === subSectionId);
    if(currentSectionIndex === courseSectionData.length - 1 && currentSubSectionIndex === noOfSubSections - 1){
      return true;
    }else{
      return false;
    }
  };

  const goToNextVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);
    const noOfSubSections =  courseSectionData[currentSectionIndex].subSection.length;
    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((data) => data._id === subSectionId);
    console.log("sub section",courseSectionData[currentSectionIndex].subSection)

    if(currentSectionIndex !== noOfSubSections - 1){
      // same section k ander video hai. go to next video in same section
      const nextSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex + 1];
      // iss video prr jao
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`);
    }else{
      // same section me video ab next nhi hai toh next section me jao.first Video in different section
      const nextSectionId = courseSectionData[currentSectionIndex + 1]._id;
      const nextSubSectionId = courseSectionData[currentSectionIndex + 1].subSection[0]._id;
      // iss video prr jao
      navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`);
    }
  };

  const goToPreviousVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);
    const noOfSubSections =  courseSectionData[currentSectionIndex].subSection.length;
    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((data) => data._id === subSectionId);

    if(currentSubSectionIndex !== 0){
      console.log("case1")
      // same section k ander video hai. go to previous video in same section
      const previousSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex - 1];
      // iss video prr jao
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${previousSubSectionId}`);
    }else{
      console.log("case2")
      // same section me video ab previous nhi hai toh previous section me jao.Last Video in different section
      const previousSectionId = courseSectionData[currentSectionIndex - 1]._id;
      const noOfPrevSubSections =  courseSectionData[currentSectionIndex - 1].subSection.length;
      const previousSubSectionId = courseSectionData[currentSectionIndex - 1].subSection[noOfPrevSubSections - 1]._id;
      // iss video prr jao
      navigate(`/view-course/${courseId}/section/${previousSectionId}/sub-section/${previousSubSectionId}`);
    }
  };

  const handleLectureCompletion = async() => {
    // dummy code baad me we will replace it with the actucal call
    setLoading(true);
    const res = await markLectureAsComplete({courseId: courseId, subSectionId: subSectionId}, token);
    if(res){
      dispatch(updateCompletedLectures(subSectionId));
    }
    setLoading(false);
  };

  return (
    <div>
      {
        !videoData ? (<div>No Data Found</div>)
        : (<Player
                ref = {playerRef}
                aspectRatio="16:9"
                playsInline
                onEnded={() => setVideoEnded(true)}
                src={videoData?.videoUrl}
          >
            <AiFillPlayCircle/>

            {
              videoEnded && (<div>{
                !completedLectures.includes(subSectionId) && (
                  <IconBtn
                    disabled={loading}
                    onClick={()=>handleLectureCompletion()}
                    text={!loading ? "mark As completed":"Loading..."}
                  />
                )
              }
              <IconBtn
                disabled={loading}
                onClick={()=>{
                  if(playerRef?.current){
                    playerRef?.current?.seek(0);
                    setVideoEnded(false);
                  }
                }}
                text="Re-Watch"
                customClasses="text-xl"
              />

              <div>
                {!isFirstVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToPreviousVideo}
                    className='blackButton'
                  >
                    Prev
                  </button>
                )}

                {!isLastVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToNextVideo}
                    className='blackButton'
                  >
                    Next
                  </button>
                )}
              </div>
              </div>)
            }

          </Player>
          )
      }
      <h1>{videoData?.title}</h1>
      <p>{videoData?.description}</p>
    </div>
  )
}

export default VideoDetails