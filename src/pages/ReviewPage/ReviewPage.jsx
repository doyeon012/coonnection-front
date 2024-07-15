import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logo from '../../assets/barking-talk.png'; // 로고 이미지 경로
import videoPlaceholder from '../../assets/people.png'; // 동영상 공간을 위한 이미지
import Declaration from '../../assets/declaration.jpg'; // 동영상 공간을 위한 이미지

import { apiCall } from '../../utils/apiCall';
import { API_LIST } from '../../utils/apiList';

const ReviewPage = () => {
    const navigate = useNavigate();  // useNavigate 훅 추가
    const [ratings, setRatings] = useState([0, 0, 0]); // 세 명의 사용자 리뷰를 관리
    const [reportingUser, setReportingUser] = useState(null); // 신고할 사용자

    const [reportReason, setReportReason] = useState(''); // 신고 이유
    const [reportDescription, setReportDescription] = useState(''); // 신고 설명
    const userInfo = useSelector((state) => state.user.userInfo);

    const [sessionId, setSessionId] = useState('');
    const [sessionData, setSessionData] = useState(null); // 세션 데이터를 저장
    const [callUserInfo, setCallUserInfo] = useState([]); // 통화 유저 정보 저장

    useEffect(() => {
        const fromVideoChat = sessionStorage.getItem('fromVideoChat');
        if (!fromVideoChat) {
            alert('비디오 채팅을 통해서만 접근 가능합니다.');
            navigate('/main', { replace: true });
            return;
        }

        // sessionStorage.removeItem('fromVideoChat'); // 초기화

        // sessionStorage에서 세션 ID를 가져옴
        const savedSessionId = sessionStorage.getItem('sessionId');
        if (savedSessionId) {
            setSessionId(savedSessionId);
            // sessionData 가져오기
            const fetchSessionData = async () => {
                try {
                    const response = await apiCall(API_LIST.GET_SESSION_DATA, {
                        sessionId: savedSessionId,
                    });
                    const filteredSessionData = response.data.filter(
                        (user) => user.userId !== userInfo.username
                    );
                    setSessionData(filteredSessionData); // 필터링한 데이터를 상태에 저장

                    // 통화 유저 정보 가져오기
                    const usernames = response.data.map((user) => user.userId);
                    const callUserInfoResponse = await apiCall(
                        API_LIST.GET_CALL_USER_INFO,
                        {
                            usernames,
                        }
                    );
                    setCallUserInfo(callUserInfoResponse.data);
                    setRatings(new Array(response.data.length).fill(0)); // 리뷰 초기화
                } catch (error) {
                    console.error('Error fetching session data:', error);
                }
            };
            fetchSessionData();
        }
    }, [navigate, userInfo.username]);

    const handleRatingChange = (index, rating) => {
        const newRatings = [...ratings];
        newRatings[index] = rating;
        setRatings(newRatings);
    };

    const handleSubmitReview = async () => {
        try {
            await apiCall(API_LIST.SUBMIT_REVIEW, {
                sessionId,
                reviews: sessionData.map((user, index) => ({
                    username: user.userId, // userId를 username으로 변경
                    rating: ratings[index],
                })),
            });
            alert('리뷰가 제출되었습니다.');
            // window.location.href = '/main';
        } catch (error) {
            console.error('Error submitting reviews:', error);
            alert('리뷰 제출 중 오류가 발생했습니다.');
        }
    };
    

    const handleReport = (username) => {
        // 신고할 사용자 설정
        setReportingUser(username);
    };

    const closeModal = () => {
        setReportingUser(null);
    };

    const submitReport = () => {
        // 신고 제출 로직
        console.log('신고된 사용자:', reportingUser);
        alert(`${reportingUser}님을 신고했습니다.`);
        setReportingUser(null);
    };

    const getProfileImage = (index) => {
        return callUserInfo[index]
            ? callUserInfo[index].profileImage
            : videoPlaceholder;
    };

    const getUtterance = (index) => {
        return callUserInfo[index]
            ? callUserInfo[index].utterance
            : '발화량 정보 없음';
    };

    const username = userInfo?.username || '사용자';

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center">
            <header className="w-full bg-[#a16e47] p-1 flex justify-between items-center">
                <div className="flex items-center">
                    <img
                        src={logo}
                        alt="명톡 로고"
                        className="w-24 h-24 ml-2"
                    />{' '}
                </div>
            </header>
            <div className="bg-gray-100  rounded-lg p-8 mt-10 w-full max-w-4xl">
                <h2 className="text-2xl font-bold text-center mb-4">
                    통화 시간이 종료되었습니다.
                </h2>
                <p className="text-center mb-6">
                    즐거운 통화 시간이 되셨나요? 리뷰를 남겨보세요!
                </p>
                <div className="space-y-6">
                    {sessionData && sessionData.length > 0 ? (
                        sessionData.map((user, index) => (
                            <div
                                key={index}
                                className="bg-gray-50 p-4 rounded-lg shadow-md flex items-center space-x-10"
                            >
                                <img
                                    src={getProfileImage(index)}
                                    alt="프로필"
                                    className="w-16 h-16 rounded-full"
                                />
                                <div className="flex-1 mr-6">
                                    <h3 className="text-xl font-semibold">
                                        {user.nickname}{' '}
                                        <span className="text-sm text-gray-500">
                                            발화량 {getUtterance(index)}
                                        </span>
                                    </h3>
                                    <div className="flex space-x-1 mt-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                className={`cursor-pointer text-2xl ${
                                                    ratings[index] >= star
                                                        ? 'text-yellow-400'
                                                        : 'text-gray-300'
                                                }`}
                                                onClick={() =>
                                                    handleRatingChange(
                                                        index,
                                                        star
                                                    )
                                                }
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center space-x-2 ml-4"
                                    onClick={() => handleReport(user.nickname)}
                                >
                                    <span>신고하기</span>
                                    <img
                                        src={Declaration}
                                        alt="이모티콘"
                                        className="w-6 h-6"
                                    />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-center">Now Loading..</p>
                    )}
                </div>
                <div className="flex justify-center mt-12 space-x-4">
                    <button
                        className="bg-gray-300 text-black px-6 py-3 rounded-full"
                        onClick={() => (window.location.href = '/main')}
                    >
                        SKIP
                    </button>
                    <button
                        className="bg-green-500 text-white px-6 py-3 rounded-full"
                        onClick={handleSubmitReview}
                    >
                        완료
                    </button>
                </div>
            </div>

            {reportingUser && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                        <header className="bg-[#a16e47] text-white p-4 rounded-t-lg flex justify-between items-center">
                            <img
                                src={logo}
                                alt="명톡 로고"
                                className="w-12 h-12"
                            />
                        </header>
                        <div className="p-6">
                            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
                                <h3 className="text-xl font-bold text-center mb-4">
                                    {reportingUser}님을 신고합니다
                                </h3>
                                <p className="text-gray-700 mb-4 text-center">
                                    신고 사유를 작성해주세요
                                </p>
                                <div className="space-y-4 w-full">
                                    {[
                                        '말 없이 대화 종료',
                                        '욕설, 부적절한 발언',
                                        '성적인 언행',
                                        '사기 및 스팸',
                                        '기타',
                                    ].map((reason) => (
                                        <label
                                            key={reason}
                                            className="flex items-center space-x-2"
                                        >
                                            <input
                                                type="radio"
                                                name="reportReason"
                                                value={reason}
                                                checked={
                                                    reportReason === reason
                                                }
                                                onChange={(e) =>
                                                    setReportReason(
                                                        e.target.value
                                                    )
                                                }
                                                className="form-radio text-red-500"
                                            />
                                            <span className="text-gray-700">
                                                {reason}
                                            </span>
                                        </label>
                                    ))}
                                    {reportReason === '기타' && (
                                        <textarea
                                            className="w-full p-2 border rounded-md"
                                            placeholder="자세한 사유를 작성해주세요..."
                                            value={reportDescription}
                                            onChange={(e) =>
                                                setReportDescription(
                                                    e.target.value
                                                )
                                            }
                                        />
                                    )}
                                </div>
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded-full mt-6"
                                    onClick={submitReport}
                                >
                                    신고하기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewPage;
