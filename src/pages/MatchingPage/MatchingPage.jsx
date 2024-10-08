import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import waitingDogImage from '../../assets/dog.png'; // 강아지 이미지
import waitingHouseImage from '../../assets/doghouse.jpg'; // 강아지 집 이미지
import { io } from 'socket.io-client';
import { apiCall } from '../../utils/apiCall';
import { API_LIST } from '../../utils/apiList';
import logo from '../../assets/barking-talk.png';
import PuppyGame from './PuppyGame';
import './MatchingPage.css';

const MatchingPage = () => {
    const [socket, setSocket] = useState(null);

    const navigate = useNavigate();
    const userInfo = useSelector((state) => state.user.userInfo);
    const [queueLength, setQueueLength] = useState(0);

    useEffect(() => {
        setSocket(io(import.meta.env.VITE_API_URL));
    }, []);

    // 사용자 데이터를 query 아닌 소켓으로 전송하게 수정했음.
    useEffect(() => {
        if (!socket) {
            return;
        }
        const storedQuestion = sessionStorage.getItem('question');
        const storedAnswer = sessionStorage.getItem('answer');

        socket.emit('userDetails', {
            userId: userInfo.username,
            userInterests: userInfo.interests,
            aiInterests: userInfo.interests2,
            nickname: userInfo.nickname,
            mbti: userInfo.mbti,
            question: storedQuestion,
            answer: storedAnswer,
        });

        socket.on('matched', (data) => {
            console.log('Matched event received:', data);
            if (data.sessionId) {
                // 질문과 답변을 세션 스토리지에서 삭제
                sessionStorage.removeItem('question');
                sessionStorage.removeItem('answer');
                location.href = '/videochat?sessionId=' + data.sessionId;
            } else {
                console.error('No sessionId in matched event data');
            }
        });

        // queueLengthUpdate 이벤트 수신
        socket.on('queueLengthUpdate', (newQueueLength) => {
            console.log('업데이트 된 큐길이 -> ', newQueueLength);
            setQueueLength(newQueueLength);
        });

        return () => {
            socket.disconnect();
        };
    }, [socket]);

    const handleCancelClick = () => {
        navigate(-1);
    };

    const createBouncingText = (text) => {
        return text
            .split('')
            .map((char, index) => <span key={index}>{char}</span>);
    };

    return (
        <div className="h-screen flex flex-col bg-gradient-to-br from-[#f7f3e9] to-[#e7d4b5] overflow-hidden">
            <header className="w-full bg-gradient-to-r from-[#a16e47] to-[#8b5e3c] p-3 flex items-center justify-between shadow-lg">
                <img
                    src={logo}
                    alt="멍톡 로고"
                    className="w-28 h-16 sm:w-60 sm:h-24"
                />
                <button
                    className="bg-[#f7f3e9] text-[#a16e47] py-3 px-6 sm:py-4 sm:px-8 md:py-5 md:px-10 rounded-full border-2 border-[#a16e47] hover:bg-[#e4d7c7] transition duration-300 text-base sm:text-lg md:text-xl font-bold whitespace-nowrap"
                    onClick={handleCancelClick}
                >
                    뒤로가기
                </button>
            </header>

            <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 md:p-10 space-y-4">
                <h2 className="text-5xl sm:text-7xl md:text-7xl font-extrabold text-[#4a3728] animate-pulse mb-4 sm:mb-6 bg-[#e7d4b5] px-10 py-4 sm:px-14 sm:py-1 rounded-full shadow-lg text-center w-11/12 max-w-3xl">
                    매칭중..
                </h2>

                <div className="bg-[#f7f3e9] bg-opacity-90 rounded-3xl shadow-2xl p-4 sm:p-10 md:p-12 w-11/12 max-w-7xl xl:max-w-8xl flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0 lg:space-x-10">
                    <div className="flex flex-col items-center space-y-8 flex-1">
                        <div className="bg-[#e7d4b5] p-6 sm:p-8 rounded-xl shadow-md w-full max-w-3xl mx-auto">
                            <p className="text-3xl sm:text-4xl md:text-5xl text-[#8b5e3c] mb-4 sm:mb-6 text-center">
                                나의 관심사
                            </p>
                            <div className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#4a3728] text-center space-y-3">
                                {userInfo.interests.map((interest, index) => (
                                    <p key={index}>{interest}</p>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <p className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-[#f7f3e9] bg-[#8b5e3c] px-6 py-4 sm:px-8 sm:py-6 rounded-full shadow-lg">
                                "{queueLength}명" <br></br> 대기 중
                            </p>
                        </div>
                    </div>

                    <div className="relative w-full lg:w-auto flex-shrink-0">
                        <div className="absolute -inset-2 bg-gradient-to-r from-[#a16e47] to-[#c18a67] rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                        <div className="relative bg-white rounded-lg p-2">
                            <PuppyGame className="w-full h-80 sm:w-96 sm:h-96" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-16 sm:h-20 bg-gradient-to-t from-[#a16e47] to-transparent opacity-30"></div>
        </div>
    );
};

export default MatchingPage;
