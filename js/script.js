// 이미지 및 리소스 로드 후 코드실행
window.onload = function(){

    // AOS 셋팅
    AOS.init();

    // Waypoint 활용
    let goTop = document.querySelector(".gotop");
    let visual = document.querySelector(".service");
    new Waypoint({
        element: visual,
        handler: function(dir) {
            if(dir === "down") {
                goTop.classList.add("active");
            } else {
                goTop.classList.remove("active");
            }
        },
        offset: "50%"
    });

    let htmlTag = document.querySelector("html");
    // 모바일 메뉴 버튼 처리
    // 1. 모바일 버튼을 찾아서 저장한다.
    let mbBt = document.querySelector(".mb-bt");
    // 2. 모바일 메뉴를 찾아서 저장한다.
    let mbNav = document.querySelector(".mb-nav");
    // 3. 로고를 찾아서 저장한다.
    let logo = document.querySelector(".logo");
    // 4. header 를 찾아서 저장한다.
    let header = document.querySelector(".header");
    // 5. gnb > li > a
    let gnbA = document.querySelectorAll(".gnb>li>a");
    // 6. mb-bt span
    let mbBtSpan = document.querySelectorAll(".mb-bt span");

    // 4. 모바일 버튼 클릭을 하면  
    mbBt.addEventListener("click", function(){
        // html scroll 없애기
        htmlTag.classList.toggle("active");
        //  로고에 active 클래스를 추가한다.
        logo.classList.toggle("active-blue");
        //  모바일 버튼에 active 클래스를 추가한다.
        mbBt.classList.toggle("active");
        // 모바일 메뉴에 active 클래스를 추가한다.
        mbNav.classList.toggle("active");
        mbBtSpan.forEach((item) => {
            item.classList.add("active");
        });   
    });
    // 화면 리사이징 처리 
    window.addEventListener("resize", function(){
        // window 의 화면 안쪽 너비 체크
        // console.log(window.innerWidth);
        let wW = window.innerWidth;
        if(wW > 1080) {
             // html scroll 없애기
            htmlTag.classList.remove("active");

            //  모바일 버튼에 active 클래스를 제거한다.
            mbBt.classList.remove("active");
            // 모바일 메뉴에 active 클래스를 제거한다.
            mbNav.classList.remove("active"); 

            // 스크롤이 되었는지 안되었는지에 따라서 처리 분리
            let scT = window.document.documentElement.scrollTop;
            if(scT > 100) {
                // 스크롤이 되었으므로
                mbBtSpan.forEach((item) => {
                    item.classList.add("active");
                });
            }else{
                // 모바일 버튼 아이콘 색상 짙게(#fff)
                mbBtSpan.forEach((item) => {
                    item.classList.remove("active");
                });
            }        

            logo.classList.remove("active-blue");
        }

    });
    // window 스크롤 처리
    window.addEventListener("scroll", function(){
        // 스크롤바가 스크롤이 된 픽셀 값을 파악
        let scT = window.document.documentElement.scrollTop;
        // 조금이라도 스크롤을 했다면 처리한다.
        if(scT > 100) {
            header.classList.add("active");
            logo.classList.add("active");
            gnbA.forEach((item) => {
                item.classList.add("active");
            });
            mbBtSpan.forEach((item) => {
                item.classList.add("active");
            });
        }else{
            header.classList.remove("active");
            logo.classList.remove("active");
            gnbA.forEach((item) => {
                item.classList.remove("active");
            });
            mbBtSpan.forEach((item) => {
                item.classList.remove("active");
            });
        }
    });
    // 화면 Reload 시 처리
    let scT = window.document.documentElement.scrollTop;
    if(scT > 100) {
        header.classList.add("active");
        logo.classList.add("active");
        gnbA.forEach((item) => {
            item.classList.add("active");
        });
        mbBtSpan.forEach((item) => {
            item.classList.add("active");
        });
    }

    // data.json 외부연동
    // 1. XMLHttpRequest 활용( 반드시 JSON.parse() 실행)
    const xhttp = new XMLHttpRequest();
    // data.json 이 불러들여졌는지 검사후 완료시 실행
    xhttp.onreadystatechange = function(e){
        const req = e.target;
        if(req.readyState === XMLHttpRequest.DONE) {
            // console.log(req.response);
            // 아래 구문을 반드시 체크하자.
            const dataArr = JSON.parse(req.response);
            // console.log(dataArr);
        }
    }
    xhttp.open("GET", "data.json");
    // 2. fetch 활용 : 아래 구문을 준수하자.
    fetch("data.json")
    .then((res) => res.json()) 
    .then((data) => {
        // 데이터를 활용한다.
        // console.log(data)
        // 데이터를 외부 변수에 저장한다.
        visualData = data.visual; 

        // 데이터 로딩후 데이터 개수 만큼 li 태그를 만든다.
        // 만들어진 글자를 모아서 swUl 태그 안쪽에 innrHtml 한다.
        let html = "";
        let count = 1;
        visualData.forEach( (item) => {
            html += `<li>${count++}</li>`;
        });
        swUl.innerHTML = html; 
        // 자바스크립트가 li를 참조하도록 적용
        swList = document.querySelectorAll(".swvisual-list li");
        // li 태그를 클릭해서 슬라이드 이동하기
        swListShow();
        showVT(visualData[0], 0);
    })
    .catch( (err) => {
        console.log(err)
    });

    // 비주얼에 활용할 데이터
    let visualData;
    // 화면에 데이터를 출력하는 함수
    const swTitle = document.querySelector(".swvisual-title");
    const swTxt = document.querySelector(".swvisual-txt");
    const swLink = document.querySelector(".swvisual-link");
    const swUl = document.querySelector(".swvisual-list");
    // li 는 동적(데이터 로딩 후)으로 만들어야 한다.
    // const 는 내용을 변경하지 못한다.
    let swList;

    // 타이틀 내용 보여주기
    function showVT(_data, _idx) {
        console.log(_data);
        swTitle.innerHTML = _data.title;
        swTxt.innerHTML = _data.txt;
        if(_data.link === "no") {
            swLink.classList.add("active");
        }else{
            swLink.classList.remove("active");
        }
        // 라인 모션 실행
        changeBar(_idx);
    }
    // 포커스 라인 애니메이션 실행함수
    function changeBar(_idx) {
        // item : 각각의 li 를 의미
        // index : 순서번호
        swList.forEach((item, index) => {
            if(index === _idx) {
                item.classList.add("active");
            }else{
                item.classList.remove("active");
            }
        });
    }
    // li 를 클릭시 슬라이드 변경함수
    function swListShow() {
        swList.forEach( (item, index) => {
            // 클릭시 슬라이드 변경
            item.addEventListener("click", function(){
                // swVisual 슬라이드를 변경 (API 참조)
                // swVisual.slideTo()
                // swVisual.slideToLoop(번호, 속도, 효과)
                swVisual.slideToLoop(index, 500, false)
            });
        })
    }

    // 비주얼 슬라이드
    let swVisual = new Swiper(".swvisual", {
        effect: "fade",
        loop: true,
        speed: 3000,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        navigation: {
            prevEl:".swvisual-prev",
            nextEl:".swvisual-next"
        }
    });

    // swVisual 슬라이드가 변경될 때마다 하고 싶은 일 진행
    swVisual.on("slideChange", function(){
        console.log("진짜 html 태그의 순서", swVisual.realIndex);
        console.log("모션이 되는 순서", swVisual.activeIndex);
        // 텍스트를 수정한다.
        showVT(visualData[swVisual.realIndex], swVisual.realIndex);
    });

    // 카테고리 슬라이드 
    new Swiper(".swcategory", {
        loop:true,
        slidesPerView: 3,        
        breakpoints: {
            480: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            }
        },
    });

    // 안내창 기능
    let categoryPop = document.querySelector(".category-pop");
    categoryPop.addEventListener("click", function() {
        categoryPop.classList.add("active");
    });

}