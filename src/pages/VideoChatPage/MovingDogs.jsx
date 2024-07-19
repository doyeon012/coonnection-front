import React, { useState, useEffect } from 'react';
import dogWalkGif from '../../assets/dog.png';
import dogHouseImage from '../../assets/doghouse.gif'; // doghouse.gif 이미지로 변경

const MovingDogs = ({ sessionData }) => {
    const safeSessionData = Array.isArray(sessionData) ? sessionData : [];
    const dogCount = Math.max(safeSessionData.length, 4); // 최소 4개의 강아지 보장

    const dogHouses = [
        { x: 8, y: 9 }, // 왼쪽 위
        { x: 36, y: 9 }, // 오른쪽 위
        { x: 64, y: 9 }, // 왼쪽 아래
        { x: 92, y: 9 }, // 오른쪽 아래
    ];
    const [dogPositions, setDogPositions] = useState(
        dogHouses.map((house) => ({
            x: house.x,
            y: house.y + 20, // 강아지 집 아래에 위치하도록 y 값 조정
        }))
    );
    const [showBubble, setShowBubble] = useState(Array(4).fill(false));

    // 모달 상태와 선택된 사용자 상태 추가
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // 강아지 집과 사용자 데이터를 매핑합니다.
    const dogHouseMapping = dogHouses.map((house, index) => ({
        house,
        data: safeSessionData[index] || { nickname: `User ${index + 1}` },
    }));


    // 강아지 집 클릭 핸들러 추가
    const handleDogHouseClick = (index) => {
        setSelectedUser(sessionData[index]);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    // 모달이 열렸을 때 5초 후에 자동으로 닫히도록 설정
    useEffect(() => {
        if (showModal) {
            const timer = setTimeout(() => {
                closeModal();
            }, 5000); // 5초 후에 모달 닫기

            return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
        }
    }, [showModal]);

    return (
        <div className="flex-1 relative" style={{ height: '300px' }}>
            {dogHouses.map((house, index) => (
                <div
                    key={index}
                    className="absolute"
                    style={{
                        left: `${house.x}%`,
                        top: `${house.y}%`,
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    <div
                        className="relative w-20 h-20"
                        onClick={() => handleDogHouseClick(index)}
                    >
                        <div className="absolute top-[-24px] left-0 w-full text-center text-xs bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white font-semibold rounded-lg py-1 shadow-md">
                            "
                            {safeSessionData[index]?.nickname ||
                                `User ${index + 1}`}
                            "님
                        </div>
                        <img
                            src={dogHouseImage}
                            alt={`Dog house ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg shadow-md"
                        />
                    </div>
                    <div
                        className="absolute"
                        style={{
                            left: '50%',
                            top: '100%',
                            transform: 'translate(-50%, 10%)',
                        }}
                    >
                        <div className="relative">
                            {showBubble[index] && (
                                <div
                                    className="absolute bg-white p-1 rounded-lg shadow-lg text-[0.75rem] flex items-center justify-center"
                                    style={{
                                        bottom: '100%',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: '120px',
                                        maxWidth: '100%',
                                        marginBottom: '-10px',
                                        padding: '10px',
                                        background:
                                            'linear-gradient(135deg, #72edf2 10%, #5151e5 100%)',
                                        color: 'white',
                                        boxShadow:
                                            '0 4px 8px rgba(0, 0, 0, 0.2)',
                                    }}
                                >
                                    {/* <svg
                                        className="absolute text-white h-3 w-3 transform -translate-x-1/2"
                                        style={{ bottom: '-6px', left: '50%' }}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path d="M12 24l-12-12h24z" />
                                    </svg> */}
                                    {/* <p className="m-0 text-center">
                                        {safeSessionData[index]?.aiInterests?.[
                                            randomInterestIndex[index]
                                        ] || '정보 없음'}
                                    </p> */}
                                </div>
                            )}
                            <img
                                src={dogWalkGif}
                                alt={`Dog ${index + 1}`}
                                className="w-16 h-16 cursor-pointer" // 크기를 w-20 h-20에서 w-16 h-16으로 줄임
                                onClick={(event) =>
                                    handleDogClick(index, event)
                                }
                            />
                            {/* <div className="absolute bottom-0 left-0 right-0 text-center text-xs bg-white bg-opacity-70 rounded-sm">
                                {safeSessionData[index]?.nickname ||
                                    `Dog ${index + 1}`}
                            </div> */}
                        </div>
                    </div>
                </div>
            ))}

            {showModal && selectedUser && (
                <div
                    className="absolute bg-white rounded-lg shadow-lg z-50"
                    style={{
                        left: '50%',
                        top: '43%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        maxWidth: '300px',
                    }}
                >
                    <header className="bg-[#a16e47] text-white p-2 rounded-t-lg flex justify-between items-center">
                        <h2 className="text-sm text-center w-full">
                            "{selectedUser.nickname}"님의 질문
                        </h2>
                        <button
                            onClick={closeModal}
                            className="absolute right-2 text-white"
                        >
                            X
                        </button>
                    </header>
                    <div className="p-4 text-center">
                        <p className="text-sm">{selectedUser.question}</p>
                        <button
                            className="mt-2 bg-red-500 text-white px-2 py-1 rounded-full mx-auto"
                            onClick={closeModal}
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovingDogs;
