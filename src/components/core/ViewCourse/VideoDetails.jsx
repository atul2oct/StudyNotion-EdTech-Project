import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI';
import { updateCompletedLectures } from '../../../slices/viewCourseSlice';
import { BigPlayButton, Player } from "video-react"
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
  const [previewSource, setPreviewSource] = useState("")
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
        const filteredData = courseSectionData.filter((course) => course._id === sectionId);
        const filteredVideoData = filteredData?.[0].subSection.filter((data) => data._id === subSectionId);
        setVideoData(filteredVideoData[0]);
        setPreviewSource(courseEntireData.thumbnail);
        setVideoEnded(false);
      }
    };
    setVideoSpecificDetails();
  }, [courseSectionData, courseEntireData, location.pathname]);

  // check if the lecture is the first video of the course
  const isFirstVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);
    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((data) => data._id === subSectionId);
    if(currentSectionIndex === 0 && currentSubSectionIndex === 0){
      return true;
    }else{
      return false;
    }
  };
  // check if the lecture is the last video of the course
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
// go to the previous video
  const goToPreviousVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);
    const noOfSubSections =  courseSectionData[currentSectionIndex].subSection.length;
    const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((data) => data._id === subSectionId);

    if(currentSubSectionIndex !== 0){
      // same section k ander video hai. go to previous video in same section
      const previousSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex - 1];
      // iss video prr jao
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${previousSubSectionId}`);
    }else{
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
console.log("playerRef?.current",playerRef?.current)
  return (
    <div className="flex flex-col gap-5 text-white">
      {
        !videoData ? 
        (
          <img
            src={previewSource}
            alt="Preview"
            className="h-full w-full rounded-md object-cover"
          />
        ) : 
        (
          <Player
            ref = {playerRef}
            aspectRatio="16:9"
            playsInline
            onEnded={() => setVideoEnded(true)}
            src={videoData?.videoUrl}
          >
            <BigPlayButton position="center"/>

            {/* Render When Video Ends */}
            {
              videoEnded && (<div className='h-full absolute inset-0 z-[100] grid place-content-center font-inter' style={{ backgroundImage: "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)", }}>
              {
                !completedLectures.includes(subSectionId) && (
                  <IconBtn
                    disabled={loading}
                    onClick={()=>handleLectureCompletion()}
                    text={!loading ? "mark As completed":"Loading..."}
                    customClasses="text-xl max-w-max px-4 mx-auto"
                  />
                )
              }
              <IconBtn
                disabled={loading}
                onClick={()=>{
                  if(playerRef?.current){
                    // set the current time of the video to 0
                    playerRef?.current?.seek(0);
                    // Replay the video by calling the play method
                    playerRef?.current?.play();
                    setVideoEnded(false);
                  }
                }}
                text="Re-Watch"
                customClasses="text-xl max-w-max px-4 mx-auto mt-2"
              />

              <div className='mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl'>
                {!isFirstVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToPreviousVideo}
                    className='Button text-richblack-900 bg-richblack-5'
                  >
                    Prev
                  </button>
                )}

                {!isLastVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToNextVideo}
                    className='Button text-richblack-900 bg-richblack-5'
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
      <h1 className="mt-4 text-3xl font-semibold">{videoData?.title}</h1>
      <p className="pt-2 pb-6">{videoData?.description}</p>
    </div>
  )
}

export default VideoDetails