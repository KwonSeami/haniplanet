type RecruitPostStatus = 'pass' | 'fail' | 'read' | 'unread';
type RecruitApplyStatus = 'impend' | 'end' | 'ongoing';

interface RecruitMemberInfo {
    age: number;
    gender?: 'male' | 'female';
    name: string;
}

interface RecruitApplyResult {
    create_at: string;
    degree_type: string;
    id: Id;
    member: RecruitMemberInfo;
    month_of_career: string;
    read_at: string;
    status: RecruitPostStatus;
    title: string;
}

interface HospitalInfo {
    id: Id;
    name: string;
}

interface IRecruitStatus {
    end_at: string;
    start_at: string;
    status: RecruitApplyStatus;
    is_active: boolean;
}

interface IRecruitApply {
    id: Id;
    status: RecruitPostStatus;
    is_eval: boolean;
}

interface IWorkDayRange extends IDateRange {
    work_start_at: string;
    work_end_at: string;
}

interface IRecruitHospitalInfo {
    capacity: number; // 모집 인원
    created_at: string; // 등록일
    end_at: string; // 모집기간 종료일
    hospital: HospitalInfo; // 한의원 정보
    hospital_type: string; // 병원 구분
    is_active: boolean; // 활성화 여부
    is_report: boolean;
    job_type: TJobType; // 모집직종
    region: string; // 근무지역
    start_at: string; // 모집기간 시작일
    status: RecruitApplyStatus; // 모집 상태
    title: string; // 채용공고 제목
    updated_at: string; // 수정일
}

interface IRecruitBaseInfo {
    id: number;
    gender: 'male' | 'femail'; // 성별
    age: string | number; // 나이
    name: string; // 담당자, 지원자
    email: string | null; // 담당자 이메일, 지원자 이메일
    contents: string; // 모집 상세, 자기소개
    phone: string; // 담당자 번호, 지원자 번호
    is_active: boolean;
}

interface IRecruitDetailRouted extends IRecruitHospitalInfo {
    age: number;
    apply: IRecruitApply;
    career_type: string; // 경력
    contents: string;
    count: number; // 지원자 수
    day_of_week: IWorkDayRange;
    email: string;
    gender: 'male' | 'female' | null;
    id: Id;
    is_active: boolean;
    is_blind: boolean;
    is_owner: boolean;
    name: string;
    pay_text: string;
    pohone: string;
    skills: ISkillInfo[];
    tool: string;
    welfare_text: string;
    work_at_text: string;
}

interface IRecruitApplyList {
    count: number;
    next: string;
    previous: string;
    results: RecruitApplyResult[];
}

// TODO: 타입 정의 필요함
interface IRecruitItem {
    // RecruitApplyList Component
    degree_type?: string;
    member?: RecruitMemberInfo;
    month_of_career?: string;
    title?: string;
}

// TODO: 타입 확인 필요
interface IAppliedRecruit extends IRecruitDetailRouted {
    apply_status: 'pass' | 'fail' | 'read' | 'unread';
}

interface IRecruitResume extends IRecruitBaseInfo, IAddress {
    briefs: IProfileCareer[]; // 약력 - Career 참고
    edus: IProfileGrade[]; // 학력 - Grade 참고
    licenses: IProfileLicense[]; // 라이센스 - License 참고
    skills: IProfileUserSkill[]; // 사용기술 - Skill 참고
    tools: IProfileTool[]; // 사용차트 - Tool 참고
    thesis: IProfileDissertation[]; // 논문 - Dissertation 참고
    birth: string;
    image: string;
    is_consultation: boolean;
    job_type: number;
    member: number;
    pay: string;
    title: string;
    wish_region: number;
    zonecode: string;
    apply_status: string;
    read_at: string | null;
}

interface IRecruitEvaluation {
    id: number;
    created_at: string;
    member: number;
    apply_status: 'pass' | 'fail' | 'read' | 'unread';
    read_at: string | null;
    resume: IRecruitResume;
}
