import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logo from '../../assets/barking-talk.png'; // 로고 이미지 경로

import crownIcon from '../../assets/crown.png'; // 왕관 아이콘 이미지

import { apiCall } from '../../utils/apiCall';
import { API_LIST } from '../../utils/apiList';

const ReviewPage = () => {
    const navigate = useNavigate(); // useNavigate 훅 추가
    const [ratings, setRatings] = useState([0, 0, 0]); // 세 명의 사용자 리뷰를 관리
    const userInfo = useSelector((state) => state.user.userInfo);

    const [sessionId, setSessionId] = useState('');
    const [topTalker, setTopTalker] = useState(null); // 오늘의 수다왕

    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [isFeedbackFetched, setIsFeedbackFetched] = useState(false);

    const [userRankings, setUserRankings] = useState([]);

    let isTTSActive = false; // TTS 활성화 상태를 저장하는 변수

    let ranking = sessionStorage.getItem('ranking');
    if (ranking) {
        ranking = JSON.parse(ranking);
    }

    useEffect(() => {
        const fromVideoChat = sessionStorage.getItem('fromVideoChat');
        if (!fromVideoChat) {
            alert('비디오 채팅을 통해서만 접근 가능합니다.');
            navigate('/main', { replace: true });
            return;
        }

        // 세션 ID 가져오기
        const savedSessionId = sessionStorage.getItem('sessionId');
        if (savedSessionId) {
            setSessionId(savedSessionId);
            fetchSessionData(savedSessionId); // 세션 데이터 가져오기
        }
    }, [navigate, userInfo.username]);

    // 세션 데이터를 가져오는 함수
    const fetchSessionData = async (sessionId) => {
        try {
            const response = await apiCall(API_LIST.GET_SESSION_DATA, {
                sessionId,
            });
            if (response.data && response.data.length > 0) {
                console.log('fetchSessionData - response.data:', response.data);

                // 통화 유저 정보 가져오기
                const usernames = response.data.map((user) => user.userId);
                const callUserInfoResponse = await apiCall(
                    API_LIST.GET_CALL_USER_INFO,
                    { usernames }
                );

                const rankArr = [];
                let ranking = sessionStorage.getItem('ranking');
                if (ranking) {
                    ranking = JSON.parse(ranking);
                    ranking.forEach((userRank, index) => {
                        const users = response.data;
                        users.forEach((user) => {
                            if (user.nickname == userRank.nickname) {
                                const profileData =
                                    callUserInfoResponse.data.find((item) => {
                                        return (
                                            item.nickname === userRank.nickname
                                        );
                                    });
                                if (profileData) {
                                    user.profileImage =
                                        profileData.profileImage;
                                    user._id = profileData._id; // _id 필드 병합
                                }

                                rankArr.push(user);
                            }
                        });
                    });
                    setUserRankings(rankArr);
                    setTopTalker(ranking[0]);
                    console.log('Top Talker:', ranking[0]);
                } else {
                    console.error('No ranking data found in sessionStorage');
                }
            } else {
                console.error('No session data found');
            }
        } catch (error) {
            console.error('Error fetching session data:', error);
        }
    };

    // 사용자 리뷰 점수를 변경하는 함수
    const handleRatingChange = (index, rating) => {
        const newRatings = [...ratings];
        newRatings[index] = rating;
        setRatings(newRatings);
    };

    // 리뷰 제출하는 함수
    const handleSubmitReview = async () => {
        try {
            await apiCall(API_LIST.SUBMIT_REVIEW, {
                sessionId,
                reviews: userRankings.map((_id, index) => ({
                    userId: _id, // userId를 username으로 변경
                    rating: ratings[index],
                })),
            });
            alert('리뷰가 제출되었습니다.');

            // sessionStorage에서 feedback을 삭제
            sessionStorage.removeItem('feedback');

            window.location.href = '/main';
        } catch (error) {
            console.error('Error submitting reviews:', error);
            alert('리뷰 제출 중 오류가 발생했습니다.');
        }
    };

    const username = userInfo?.username || '사용자';

    const fetchFeedback = async () => {
        const savedFeedback = sessionStorage.getItem('feedback');
        if (savedFeedback) {
            setFeedback(savedFeedback);

            // 첫 문장 추출
            const firstSentence = savedFeedback.split('. ')[0] + '.';
            speakText(firstSentence);

            setIsFeedbackFetched(true);
        }
        setIsFeedbackModalOpen(true);
    };

    const speakText = (text, delay) => {
        if (isTTSActive) {
            return; // TTS가 이미 실행 중인 경우 함수 종료
        }

        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ko-KR'; // 언어 설정 (한국어)
            utterance.rate = 1.2; // 말하기 속도 조절 (기본값: 1)
            utterance.pitch = 0.6; // 음조 조절 (기본값: 1)

            const voices = window.speechSynthesis.getVoices();
            console.log('사용 가능: ', voices);
            const selectedVoice = voices.find((voice) =>
                voice.name.includes('Google 한국의')
            );

            if (selectedVoice) {
                utterance.voice = selectedVoice;
            } else {
                console.warn(
                    `Voice 'Google 한국의' not found. Using default voice.`
                );
            }

            utterance.onstart = () => {
                isTTSActive = true; // TTS 시작 시 플래그 설정
            };

            utterance.onend = () => {
                isTTSActive = false; // TTS 끝날 시 플래그 리셋
            };

            window.speechSynthesis.speak(utterance);
        } else {
            console.error('This browser does not support speech synthesis.');
        }
    };

    return (
        <div className="h-screen bg-gray-100 flex flex-col">
            <header className="w-full bg-gradient-to-r from-[#a16e47] to-[#8b5e3c] p-3 flex items-center shadow-lg">
                <img
                    src={logo}
                    alt="멍톡 로고"
                    className="w-28 h-16 sm:w-60 sm:h-24"
                />
            </header>
            <div className="flex-1 overflow-auto flex flex-col p-4 sm:p-5">
                {topTalker && (
                    <div className="text-center mb-4 p-3 sm:p-4 border-2 border-yellow-400 bg-yellow-50 rounded-lg flex items-center justify-center">
                        <div>
                            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-yellow-600 mb-2">
                                오늘의 수다왕
                            </h2>
                            <h3 className="text-2xl sm:text-4xl lg:text-5xl font-semibold mb-1">
                                '{topTalker.nickname}'님
                            </h3>
                        </div>
                        <div className="ml-4 sm:ml-6">
                            <img
                                src={crownIcon}
                                alt="왕관"
                                className="w-20 h-20 sm:w-24 sm:h-24"
                            />
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 flex-1">
                    {userRankings && userRankings.length > 0 ? (
                        userRankings.map((user, index) => (
                            <div
                                key={index}
                                className="bg-white p-1 sm:p-4 rounded-lg shadow-lg flex items-center space-x-4 sm:space-x-5"
                            >
                                <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                                    <img
                                        src={user.profileImage}
                                        alt="프로필"
                                        className="w-16 h-16 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full"
                                    />
                                    <div className="flex  sm:space-x-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                className={`cursor-pointer text-2xl sm:text-5xl ${
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
                                <div className="flex-1 flex items-center space-x-3 sm:space-x-6">
                                    <h3 className="text-2xl sm:text-5xl lg:text-6xl font-semibold mb-2">
                                        {user.nickname}
                                    </h3>
                                    <p className="text-lg sm:text-4xl lg:text-5xl font-bold text-gray-500 drop-shadow-lg">
                                        ({index + 1}등)
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-2xl sm:text-3xl col-span-2">
                            Now Loading..
                        </p>
                    )}
                </div>

                <div className="flex justify-center mt-4 sm:mt-6 space-x-4 sm:space-x-6">
                    <button
                        className="bg-gray-300 text-black px-8 py-4 sm:px-12 sm:py-6 rounded-full text-2xl sm:text-3xl font-bold"
                        onClick={fetchFeedback}
                    >
                        AI 피드백
                    </button>
                    <button
                        className="bg-green-500 text-white px-8 py-4 sm:px-12 sm:py-6 rounded-full text-2xl sm:text-3xl font-bold"
                        onClick={handleSubmitReview}
                    >
                        완료
                    </button>
                </div>
            </div>

            {isFeedbackModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl shadow-2xl w-11/12 max-w-5xl p-8 text-center transform transition-all duration-300 scale-105 hover:scale-110 border-2 border-gray-300 backdrop-filter backdrop-blur-sm">
                        <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 text-black animate-pulse">
                            🤖 AI 피드백
                        </h2>

                        <div className="space-y-6 max-h-[60vh] overflow-y-auto px-4">
                            {feedback ? (
                                feedback.split('\n').map((line, index) => (
                                    <p
                                        key={index}
                                        className="text-xl sm:text-2xl text-black leading-relaxed tracking-wide"
                                    >
                                        {line}
                                    </p>
                                ))
                            ) : (
                                <p className="text-2xl sm:text-3xl text-gray-600 animate-pulse">
                                    피드백을 불러오는 중...
                                </p>
                            )}
                        </div>

                        <button
                            className="mt-8 bg-gradient-to-r from-gray-400 to-gray-600 text-white px-8 py-3 rounded-full text-xl sm:text-2xl font-bold hover:from-gray-500 hover:to-gray-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                            onClick={() => {
                                window.speechSynthesis.cancel(); // TTS 중단
                                setIsFeedbackModalOpen(false);
                            }}
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewPage;
