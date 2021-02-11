/**********************
 * Profile Globals
 **********************/
type InputORSelect = React.FormEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>;

interface IProfile extends HasId {
    title: string;
    created_at: number;
    type: string;
}

/**********************
 * Profile Job
 **********************/
interface IProfileJob extends HasId {
    job_type: number;
    title: string;
    image: string;
    contents: string;
    pay: string;
    wish_region: number;
    is_consultation: boolean;
}

/**********************
 * Profile Dissertation
 **********************/
interface IProfileDissertation extends HasId {
    title: string;
}

/**********************
 * Profile Career
 **********************/
interface IProfileCareer extends HasId {
    member: IUser;
    title: string;
    start_at: string;
    end_at: string;
}

/**********************
 * Profile Grade
 **********************/
interface IProfileGrade extends HasId {
    member: IUser;
    school_name: string;
    degree_type: string;
    major_name: string;
    status: string;
    admission_at: string;
    graduate_at: string;
}

/**********************
 * Profile Hospital
 **********************/
interface IProfileHospital extends HasId {
    hospital: IHospitalRegistered;
    member: Id;
    position: string;
    subject_text: string;
    image: string;
    is_owner: boolean;
    order: number;
}

/**********************
 * Profile License
 **********************/
interface IProfileLicense extends HasId {
    member: IUser;
    license_name: string;
    issuing_organization: string;
    acquisition_at: string;
    is_specialist: boolean;
}

/**********************
 * Profile Tool
 **********************/
interface IProfileToolDataSet {
    [key: string]: {
        title: string;
    } & HasId;
}

interface IProfileTool extends HasId {
    tool: number;
    level: T_LevelType;
}

/**********************
 * Profile Skill
 **********************/
interface IProfileSkill extends HasId {
    title: string;
}

interface FetchedSkill extends IProfileSkill {
    details: Id[];
}

interface ISkillDetail extends IProfileSkill {}

interface IProfileUserSkill extends HasId {
    level: T_LevelType;
    text: string;
    skill: IUserSkill;
    skill_detail: IUserSkillDetail;
}

interface IUserSkill extends IProfileSkill {}

interface IUserSkillDetail extends IProfileSkill {}
