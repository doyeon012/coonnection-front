import React from 'react';
import serviceImage1 from '../../assets/service1.png';
import serviceImage2 from '../../assets/service2.png';
import serviceImage3 from '../../assets/service3.png';
import serviceImage4 from '../../assets/service4.png';

const Slide1 = () => (
    <div className="content">
        <br></br>
        <h2
            className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center mt-10"
            style={{ fontSize: '35px', marginBottom: '0' }}
        >
            안녕하세요!
        </h2>
        <h2
            className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center mt-8"
            style={{ fontSize: '35px', marginBottom: '0' }}
        >
            멍톡에 오신 걸 환영해요!
        </h2>
        <h2
            className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center mt-8"
            style={{ fontSize: '35px', marginBottom: '0' }}
        >
            저희 멍톡은 '대화가 어색한 사람들'을 위해 이러한 서비스를 제공하고
            있어요.
        </h2>
        <br></br>
        <div className="services-container mt-14">
            <div className="service-item mt-4">
                <img
                    src={serviceImage1}
                    alt="질문 미션"
                    className="service-image"
                />
                <h2
                    className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center mt-8"
                    style={{ fontSize: '30px' }}
                >
                    질문 미션
                </h2>
                <p style={{ fontSize: '25px' }}>
                    상대방에 대해<br></br>
                    자연스럽게 알아가봐요!
                </p>
            </div>
            <div className="service-item mt-4">
                <img
                    src={serviceImage2}
                    alt="주제 추천"
                    className="service-image"
                />

                <h2
                    className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center mt-8"
                    style={{ fontSize: '30px' }}
                >
                    주제 추천
                </h2>
                <p style={{ fontSize: '25px' }}>대화를 이끌어가보세요!</p>
            </div>
            <div className="service-item mt-4">
                <img
                    src={serviceImage3}
                    alt="마스킹 & 음성변조"
                    className="service-image"
                />
                <h2
                    className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center mt-8"
                    style={{ fontSize: '30px' }}
                >
                    마스킹 & 음성변조
                </h2>
                <p style={{ fontSize: '25px' }}>
                    나를 드러내기 부끄럽다면?<br></br>
                    숨겨드릴게요!
                </p>
            </div>
            <div className="service-item mt-4">
                <img src={serviceImage4} alt="매칭" className="service-image" />
                <h2
                    className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center mt-8"
                    style={{ fontSize: '30px' }}
                >
                    관심사 기반 매칭
                </h2>
                <p style={{ fontSize: '25px' }}>
                    잘 맞을 것 같은 상대를<br></br>
                    찾아드려요!
                </p>
            </div>
        </div>
    </div>
);

export default Slide1;
