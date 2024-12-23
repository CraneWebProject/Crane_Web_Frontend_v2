import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components"
import Pagination from "../components/Pagination";
import BoardTab from "../components/boardTab";

export interface User{
    uid: number;
    userName: string;
    userPic: string;
    userTh: number;
    session: String;
}

export interface BoardPost{
    bid: string;
    boardTitle: string;
    boardContents: string;
    boardView: number;
    boardCategory:string;
    userResponseDto: User;
    createdDate: number;
    thumbNaile: string;
}

const Wrapper = styled.div`
    display: flex;
    flex-direction:column;


    margin-left: 15vw;
    margin-right: 15vw;


`;

const TabContainer = styled.div`
    margin-top: 64px;
`;

const SelectorContainer = styled.div`
    display:flex;
`;

const Post = styled.div`
    
`;

const BoardContainer = styled.div`
    
`;

const BoardTable = styled.table`
    display:table;

    width: 100%;
    border-collapse: collapse; 
`;

const BoardThead = styled.thead`
    /* display:table-header-group; */
    font-weight: 700;

`;

const BoardTbody = styled.tbody`
    /* display:table-row-group; */
`;

const BoardTh = styled.th`
    display:table-cell;
    border-bottom: 1px solid #dddfe0;
    padding: 8px;
    vertical-align: top;
    
    text-align: center;
    /* font-weight: 700; */

   &.date{
    font-size:14px;
   }
`;

const BoardTr = styled.tr`
    display:table-row;
`;

const BoardTitle = styled.a`
    text-decoration:none;
    color:black;
    display: inline-block;
    
    &:hover{
        cursor: pointer;
        text-decoration:underline;
    }
`;

const PageContainer = styled.div`

`;

const Write = styled.a`
    margin-left: auto; 
    padding: 10px 20px;
    background-color: #001D6C;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    margin-top: 10px;

    &:hover {
        background-color: #0056b3;
    }
`


export default function Board(){
    const [category, setCategory] = useState<string>("NOTICE");
    
    const[page, setPage] = useState<number>(1);
    const[boardItems, setBoardItems] = useState<BoardPost[]>([]);
    // const[pageSize, setPageSize] = useState();
    // const[totalElements, setTotalElements] = useState();
    const[totalPages, setTotalPages] = useState<number>(1);
    // const[isFirst, setIsFirst] = useState();
    // const[isLast, setIsLast] = useState();
    // const[isEmpty, setIsEmpty] = useState();
    const[pageNumber, setPageNumber] = useState<number>(Number(page) || 1);
    // const[message, setMessage] = useState<string>("");



    function formatDateString(dateString: string) {
        const [datePart, timePart] = dateString.split('T'); // 'T'로 날짜와 시간 분리
        const [hours, minutes] = timePart.split(':'); // 시간에서 시와 분 분리
        return `${datePart} ${hours}:${minutes}`; // 'YYYY-MM-DD HH:MM' 형식으로 반환
    }

    useEffect(() =>{
        const fetchBoard = async() => {
            axios.get(
                `${import.meta.env.VITE_API_URL}/board/list`,
                {params:{
                    "category": `${category}`,
                    "page" : page - 1
                }}
            ).then(res => {
                setBoardItems(res.data.contents);
                // setPageSize(res.data.pageSize);
                // setTotalElements(res.data.totlaElements);
                setTotalPages(res.data.totalPages);
                // setIsFirst(res.data.first);
                // setIsLast(res.data.last);
                // setIsEmpty(res.data.empty);
                // setMessage(res.data.message);
            })
        }
        
        fetchBoard();
        setPageNumber(Number(page) || 1); 
    }, [category, page])

    useEffect(() => {
        // URL에서 page 값을 읽어옴
        const searchParams = new URLSearchParams(location.search);
        const pageParam = searchParams.get('page');
        const categoryParam = searchParams.get('category');
        
        if (pageParam != null) {
            setPage(Number(pageParam));  // 페이지 상태 업데이트
        }

        if(categoryParam != null){
            setCategory(categoryParam.toString());
        }
    }, [location.search]);  // location.search가 바뀔 때마다 실행


    return(
        <Wrapper>
            <TabContainer>
                <SelectorContainer>
                    <BoardTab category={category} setCategory={setCategory} />    
                </SelectorContainer>


                <Post>
                    
                </Post>

                <BoardContainer>
                    <BoardTable>
                        <BoardThead>
                            <BoardTr>
                                <BoardTh style={{ width: "10.7142%" }}>
                                    #
                                </BoardTh>
                                <BoardTh style={{ width: "57.1432%" }}>
                                    제목
                                </BoardTh>
                                <BoardTh style={{ width: "10.7142%" }}>
                                    작성자
                                </BoardTh>
                                <BoardTh style={{ width: "10.7142%" }}>
                                    작성일시
                                </BoardTh>
                                <BoardTh style={{ width: "10.7142%" }}>
                                    조회수
                                </BoardTh>
                            </BoardTr>
                        </BoardThead>
                        <BoardTbody>
                            {boardItems.length === 0 ? (
                                <BoardTr>
                                    <BoardTh colSpan={5}>빈 게시판</BoardTh>
                                </BoardTr>
                            ) : (
                                boardItems.map((item) => (
                                    <BoardTr key={item.bid}>
                                        <BoardTh>{item.bid}</BoardTh>
                                        <BoardTh><BoardTitle href={`/board/detail/${item.bid}`}>{item.boardTitle}</BoardTitle></BoardTh>
                                        <BoardTh>{`${item.userResponseDto.userTh}기 ${item.userResponseDto.userName}`}</BoardTh>
                                        <BoardTh className="date">{formatDateString(item.createdDate.toString())}</BoardTh>
                                        <BoardTh>{item.boardView}</BoardTh>
                                    </BoardTr>
                                ))
                            )}
                        </BoardTbody>
                    </BoardTable>
                </BoardContainer>
            </TabContainer>
            <Write href={`/board/edit`}>
                글쓰기
            </Write>
            <PageContainer>
                <Pagination
                    page={pageNumber}
                    setPage = {setPageNumber}
                    totalPages={totalPages}
                    link = {`gallery`}
                />
            </PageContainer>

        </Wrapper>
    )
}