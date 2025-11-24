// ===================================================================
// SURVEY CONSTANTS - Three-stage structure
// ===================================================================

// ===================================================================
// STAGE 1: CONSENT FORM
// ===================================================================

// Consent form headings and introductory text
export const CONSENT_WELCOME = "TWON Research Study - Informed Consent";
export const CONSENT_INTRODUCTION = "We invite you to participate in a research study about social media and political discussions. Please read the following information carefully before deciding whether to participate.";

// Study information sections
export const CONSENT_STUDY_TITLE = "TWON - Twin of an Online Social Network";
export const CONSENT_RESEARCHERS = "This study is conducted by researchers from the University of Amsterdam in collaboration with the University of Trier, Robert Koch Institute, Jožef Stefan Institute, and University of Belgrade.";

export const CONSENT_PURPOSE_TITLE = "Purpose of the Study";
export const CONSENT_PURPOSE = "The purpose of this research is to better understand how social media platforms influence their users' activities and interactions with other users, in order to explain and prevent negative impacts on democracy.";

export const CONSENT_PROCEDURE_TITLE = "What Will You Be Asked to Do?";
export const CONSENT_PROCEDURE = "You will be asked to use the TWON social media platform developed by our research group. Some content on this platform comes from other existing platforms, while some content is automatically generated. You should use the platform the same way you would use any other social network - for example, by liking, sharing and commenting on other users' posts or clicking on links to read posted news.";

export const CONSENT_REQUIREMENTS_TITLE = "For successful completion of the study, we ask you to:";
export const CONSENT_REQUIREMENTS = [
  "Write at least one post on the network",
  "Post at least three comments", 
  "Give at least one 'like'"
];

export const CONSENT_TIME_TITLE = "Time Commitment";
export const CONSENT_TIME = "At the beginning and end of the study you will need to complete a short questionnaire about your user experience and some general demographic information about yourself. In total, the time required from you during the study is approximately 30 minutes to an hour when you add up daily network usage and time needed to complete questionnaires.";

export const CONSENT_VOLUNTARY_TITLE = "Voluntary Participation";
export const CONSENT_VOLUNTARY = "Your participation in this study is voluntary - you are not obligated to participate. You can stop your participation at any time during the study, as well as withdraw your data after the study is completed. You do not have to state a reason for withdrawal. Apart from the fact that you will not receive compensation, withdrawal from participation or withdrawal of data will have no negative consequences for you.";

export const CONSENT_DATA_PROTECTION_TITLE = "Data Protection";
export const CONSENT_DATA_PROTECTION = "We treat your personal data completely anonymously in accordance with legal regulations (General Data Protection Regulation - GDPR in the European Union and European Economic Area).";

export const CONSENT_DATA_SHARING_TITLE = "Data Sharing";
export const CONSENT_DATA_SHARING = "The results of this study may be shared with other researchers and/or published through a public database (open access), without personal data or information that could individually identify participants. The results may be used in future research on topics not necessarily related to this study.";

// Consent checklist questions
export const CONSENT_QUESTIONS = [
  "I am 18 years of age or older",
  "I have read and understood all the information about this study",
  "I agree to participate in this study and to the use of data obtained from it",
  "I retain the right to withdraw this consent without giving reasons",
  "I retain the right to stop participating in the study at any time if I wish",
  "I understand that my data will be processed by partner institution Jožef Stefan Institute (JSI) as a third party"
];

// Consent form buttons
export const CONSENT_AGREE = "Yes, I agree to participate";
export const CONSENT_DISAGREE = "No, I do not wish to participate";

// Contact information
export const CONSENT_CONTACT_TITLE = "Contact Information";
export const CONSENT_CONTACT = "If you have any questions about the study, you can contact the responsible researcher Michael Heseltine via email: m.j.heseltine@uva.nl";

export const CONSENT_COMPLAINTS_TITLE = "Complaints";
export const CONSENT_COMPLAINTS = "If you have any complaints about the study or research, please contact the ASCoR Ethics Committee at: ASCoR Ethics Committee Secretariat, University of Amsterdam, PO Box 15793, 1001 NG Amsterdam; Phone: +31 20 525 3680; Email: ascor-secr-fmg@uva.nl";

// ===================================================================
// STAGE 2: ONE-TIME QUESTIONS (Demographics & Background)
// ===================================================================

export const ONETIME_INTRO = "First, we'd like to collect some basic information about you.";

// Q1: Demographic questions
export const DEMO_AGE_QUESTION = "What is your age?";
export const DEMO_AGE_OPTIONS = [
  "18–24",
  "25–34", 
  "35–44",
  "45–54",
  "55–64",
  "65+"
];

export const DEMO_GENDER_QUESTION = "What is your gender?";
export const DEMO_GENDER_OPTIONS = [
  "Male", 
  "Female", 
  "Prefer not to say",
  "Other"
];

export const DEMO_EDUCATION_QUESTION = "What is your highest completed level of education?";
export const DEMO_EDUCATION_OPTIONS = [
  "Elementary school",
  "High School",
  "Bachelor's degree",
  "Master's degree",
  "PhD",
  "Other"
];

export const DEMO_EMPLOYMENT_QUESTION = "What is your current employment status?";
export const DEMO_EMPLOYMENT_OPTIONS = [
  "Employed full-time",
  "Employed part-time",
  "Self-employed",
  "Unemployed",
  "Studying",
  "Retired",
  "Other"
];

// Q2: Civil engagement
export const CIVIL_ENGAGEMENT_INTRO = "Please answer the following questions about your civic engagement:";

export const CIVIL_VOTED_QUESTION = "How regularly do you vote?";
export const CIVIL_VOTED_OPTIONS = [
  { value: "1", label: "1 (Never)" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5 (Always)" }
];

export const CIVIL_ACTIVITIES_QUESTION = "How often do you participate in any political activity outside voting (e.g., signing a petition, attending a protest, volunteering for a campaign)?";
export const CIVIL_ACTIVITIES_OPTIONS = [
  { value: "1", label: "1 (Never)" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5 (Any time you can)" }
];

export const CIVIL_MEMBER_QUESTION = "Are you a member of any political party or political organization?";
export const CIVIL_MEMBER_OPTIONS = ["Yes", "No"];

// Q3: News consumption
export const NEWS_CONSUMPTION_INTRO = "Please tell us about your news consumption habits:";

export const NEWS_FREQUENCY_QUESTION = "How often do you consume news?";
export const NEWS_FREQUENCY_OPTIONS = [
  "Several times a day",
  "Once a day",
  "A few times a week",
  "Rarely",
  "Never"
];

export const NEWS_FREQUENCY2_QUESTION = "How regularly do you read/watch political related content?";
export const NEWS_FREQUENCY2_OPTIONS = [
  "Several times a day",
  "Once a day",
  "A few times a week",
  "Rarely",
  "Never"
];

export const NEWS_SOURCE_QUESTION = "What are your primary sources of news consumption? (select all that apply)";
export const NEWS_SOURCE_OPTIONS = [
  "Television",
  "Newspapers",
  "Radio",
  "Online news websites",
  "Social media",
  "Other"
];



// ===================================================================
// STAGE 3: WEEKLY QUESTIONS (Recurring - Topic-Based)
// ===================================================================

export const WEEKLY_INTRO = "Please answer the following questions about your current topic.";

// Q1: Overall attitude toward the topic (1-100 scale)
export const WEEKLY_ATTITUDE_QUESTION = "On a scale from 1 to 100, how warm or favorable do you feel toward";
export const WEEKLY_ATTITUDE_SCALE = "1 = Very unfavorable, 50 = Neutral, 100 = Very favorable";

// Section heading for "one side" advocates
export const WEEKLY_ONE_SIDE_INTRO = "Please rate advocates of ONE SIDE on the following traits:";

// Q2-Q7: Perception of ONE SIDE advocates
export const WEEKLY_ONE_SIDE_OPENMINDED_QUESTION = "How would you rate them on: Close-minded vs Open-minded";
export const WEEKLY_ONE_SIDE_OPENMINDED_SCALE = "1 = Close-minded, 10 = Open-minded";

export const WEEKLY_ONE_SIDE_MODERATE_QUESTION = "How would you rate them on: Extreme vs Moderate";
export const WEEKLY_ONE_SIDE_MODERATE_SCALE = "1 = Extreme, 10 = Moderate";

export const WEEKLY_ONE_SIDE_MORAL_QUESTION = "How would you rate them on: Immoral vs Moral";
export const WEEKLY_ONE_SIDE_MORAL_SCALE = "1 = Immoral, 10 = Moral";

export const WEEKLY_ONE_SIDE_SOCIAL_INTRO = "How happy would you feel if an advocate of this side was your:";

export const WEEKLY_ONE_SIDE_FAMILY_QUESTION = "Immediate family member?";
export const WEEKLY_ONE_SIDE_FAMILY_SCALE = "1 = Very unhappy, 10 = Very happy";

export const WEEKLY_ONE_SIDE_FRIEND_QUESTION = "Close friend?";
export const WEEKLY_ONE_SIDE_FRIEND_SCALE = "1 = Very unhappy, 10 = Very happy";

export const WEEKLY_ONE_SIDE_COWORKER_QUESTION = "Coworker?";
export const WEEKLY_ONE_SIDE_COWORKER_SCALE = "1 = Very unhappy, 10 = Very happy";

// Section heading for "other side" advocates
export const WEEKLY_OTHER_SIDE_INTRO = "Please rate advocates of the OTHER SIDE on the following traits:";

// Q8-Q13: Perception of OTHER SIDE advocates
export const WEEKLY_OTHER_SIDE_OPENMINDED_QUESTION = "How would you rate them on: Close-minded vs Open-minded";
export const WEEKLY_OTHER_SIDE_OPENMINDED_SCALE = "1 = Close-minded, 10 = Open-minded";

export const WEEKLY_OTHER_SIDE_MODERATE_QUESTION = "How would you rate them on: Extreme vs Moderate";
export const WEEKLY_OTHER_SIDE_MODERATE_SCALE = "1 = Extreme, 10 = Moderate";

export const WEEKLY_OTHER_SIDE_MORAL_QUESTION = "How would you rate them on: Immoral vs Moral";
export const WEEKLY_OTHER_SIDE_MORAL_SCALE = "1 = Immoral, 10 = Moral";

export const WEEKLY_OTHER_SIDE_SOCIAL_INTRO = "How happy would you feel if an advocate of this side was your:";

export const WEEKLY_OTHER_SIDE_FAMILY_QUESTION = "Immediate family member?";
export const WEEKLY_OTHER_SIDE_FAMILY_SCALE = "1 = Very unhappy, 10 = Very happy";

export const WEEKLY_OTHER_SIDE_FRIEND_QUESTION = "Close friend?";
export const WEEKLY_OTHER_SIDE_FRIEND_SCALE = "1 = Very unhappy, 10 = Very happy";

export const WEEKLY_OTHER_SIDE_COWORKER_QUESTION = "Coworker?";
export const WEEKLY_OTHER_SIDE_COWORKER_SCALE = "1 = Very unhappy, 10 = Very happy";

// ===================================================================
// SHARED UI ELEMENTS
// ===================================================================

// Navigation buttons
export const BTN_NEXT = "Next";
export const BTN_PREVIOUS = "Previous";
export const BTN_SUBMIT = "Submit";
export const BTN_CONTINUE = "Continue";

// Progress indicators
export const PROGRESS_CONSENT = "Consent Form";
export const PROGRESS_DEMOGRAPHICS = "Basic Information";
export const PROGRESS_WEEKLY = "Weekly Questions";

// Error messages
export const ERROR_REQUIRED_FIELD = "This field is required";
export const ERROR_INVALID_AGE = "Please enter a valid age";
export const ERROR_NETWORK = "Network error. Please try again.";

// Success messages
export const SUCCESS_CONSENT = "Thank you for agreeing to participate!";
export const SUCCESS_DEMOGRAPHICS = "Basic information saved successfully.";
export const SUCCESS_WEEKLY = "Weekly responses submitted successfully.";

// ===================================================================
// LEGACY UI ELEMENTS (Keep for existing functionality)
// ===================================================================

export const followers = "Followers";
export const followings = "Following";
export const email = "Email";
export const Password = "Password";
export const Send = "Send";
export const comments = "Comments";
export const Write_something = "Write something...";
export const A_user_with = "A user with this name/email already exists. Use a different name/email address. Or the URL used for registration is incorrect.";

// ===================================================================
// POST-SURVEY CONSTANTS (copied from backup)
// ===================================================================

export const Submit_Post_Survey = "Pošaljite odgovore";
export const last_info1 = "Na kraju";
export const last_info2 = "Hvala Vam što ste učestvovali u našoj studiji! Vaš doprinos je ključan za uspeh našeg projekta.";
export const last_info3 = "Studija je sprovedena u okviru projekta finansiranog od strane EU pod nazivom 'TWON – Twin of an online social network', koji ima za cilj istraživanje potencijalno štetnih efekata onlajn društvenih mreža (OSN) na demokratske debate. Kreiranjem digitalnog dvojnika onlajn društvene mreže i populisanjem iste generativnom veštačkom inteligencijom, tim TWON-a primenjuje jedinstveni pristup u proučavanju demokratskih onlajn debata koji je nezavisan od dobre volje kompanija poput X-a, Mete ili Tiktoka. Partneri u projektu su Univerzitet u Amsterdamu, Univerzitet u Trieru, Institut Jožef Stefan, Tehnološki institut Karlsruhe (KIT), Institut Robert Koh, Univerzitet u Beogradu, Slovenačka novinska agencija, Istraživački centar za računarske nauke i DialoguePerspectives e.V.";
export const last_info4 = "Više informacija o TWON projektu možete pronaći ovde:";
export const last_info5 = "https://www.twon-project.eu/ ";
export const review_is_onward = "Napomena: Na kraju ankete možete još jednom proveriti i izmeniti svoje odgovore.";
export const post_q8_info = "Molimo Vas da kliknete ovde kako biste završili upitnik i primili svoju nadoknadu.";

// Post survey questions and options
export const post_q1_0 = "8. Molimo Vas da navedete koliko se slažete ili ne slažete sa sledećom izjavom:";
export const post_q1 = "Uživam u isprobavanju novih i različitih stvari.";
export const post_q1_op1 = "1 U potpunosti se ne slažem";
export const post_q1_op2 = "2 Ne slažem se";
export const post_q1_op3 = "3 Ni slažem se ni ne slažem se";
export const post_q1_op4 = "4 Slažem se";
export const post_q1_op5 = "5 U potpunosti se slažem";

export const post_q2 = "Organizovan/na sam i volim da planiram unapred.";
export const post_q2_op1 = "1 U potpunosti se ne slažem";
export const post_q2_op2 = "2 Ne slažem se";
export const post_q2_op3 = "3 Ni slažem se ni ne slažem se";
export const post_q2_op4 = "4 Slažem se";
export const post_q2_op5 = "5 U potpunosti se slažem";

export const post_q3 = "Druželjubiv/a sam i volim da budem u društvu.";
export const post_q3_op1 = "1 U potpunosti se ne slažem";
export const post_q3_op2 = "2 Ne slažem se";
export const post_q3_op3 = "3 Ni slažem se ni ne slažem se";
export const post_q3_op4 = "4 Slažem se";
export const post_q3_op5 = "5 U potpunosti se slažem";

export const post_q4 = "Obziran/na sam i dobro se slažem sa drugima.";
export const post_q4_op1 = "1 U potpunosti se ne slažem";
export const post_q4_op2 = "2 Ne slažem se";
export const post_q4_op3 = "3 Ni slažem se ni ne slažem se";
export const post_q4_op4 = "4 Slažem se";
export const post_q4_op5 = "5 U potpunosti se slažem";

export const post_q5 = "Često osećam anksioznost ili stres.";
export const post_q5_op1 = "1 U potpunosti se ne slažem";
export const post_q5_op2 = "2 Ne slažem se";
export const post_q5_op3 = "3 Ni slažem se ni ne slažem se";
export const post_q5_op4 = "4 Slažem se";
export const post_q5_op5 = "5 U potpunosti se slažem";

export const post_q6 = "Više volim da analiziram sve dostupne informacije temeljno i sistematično pre donošenja odluke.";
export const post_q6_op1 = "1 U potpunosti se ne slažem";
export const post_q6_op2 = "2 Ne slažem se";
export const post_q6_op3 = "3 Neutralno";
export const post_q6_op4 = "4 Slažem se";
export const post_q6_op5 = "5 U potpunosti se slažem";

export const post_q7 = "Često se oslanjam na svoje instinkte ili intuiciju prilikom donošenja odluka.";
export const post_q7_op1 = "1 U potpunosti se ne slažem";
export const post_q7_op2 = "2 Ne slažem se";
export const post_q7_op3 = "3 Neutralno";
export const post_q7_op4 = "4 Slažem se";
export const post_q7_op5 = "5 U potpunosti se slažem";

export const post_q8_0 = "9. Molimo Vas da navedete koliko se slažete ili ne slažete sa sledećom izjavom odabirom broja od 0 do 10: ";
export const post_q8 = "Mislim da postoje tajne organizacije koje u velikoj meri utiču na političke odluke.";
export const post_q8_op1 = "1 U potpunosti se ne slažem [0]";
export const post_q8_op2 = "2";
export const post_q8_op3 = "3";
export const post_q8_op4 = "4";
export const post_q8_op5 = "5";
export const post_q8_op6 = "6";
export const post_q8_op7 = "7";
export const post_q8_op8 = "8";
export const post_q8_op9 = "9";
export const post_q8_op10 = "10 U potpunosti se slažem";

export const post_q9 = "10. Opišite svoj idealni vikend. (Odaberite sve šta je primenjivo)";
export const post_q9_op1 = "1 Odmaranje kod kuće";
export const post_q9_op2 = "2 Druženje sa prijateljima i porodicom";
export const post_q9_op3 = "3 Učestvovanje u aktivnostima na otvorenom";
export const post_q9_op4 = "4 Prisustvovanje kulturnim događajima (npr. koncerti, galerije)";
export const post_q9_op5 = "5 Rad na ličnim projektima ili hobijima";
export const post_q9_op6 = "6 Putovanje ili istraživanje novih mesta";
export const post_q9_op7 = "7 Volontiranje ili društveno korisni rad";
export const post_q9_op8 = "8 Šoping ili izlazak na večeru";
export const post_q9_op9 = "9 Drugo:";

export const post_q10 = "Cenim tradiciju i konvencionalne načine obavljanja stvari.";
export const post_q10_op1 = "1 U potpunosti se ne slažem";
export const post_q10_op2 = "2 Ne slažem se";
export const post_q10_op3 = "3 Ni slažem se ni ne slažem se";
export const post_q10_op4 = "4 Slažem se";
export const post_q10_op5 = "5 U potpunosti se slažem";

export const post_q11 = "11. Koje žanrove knjiga, filmova ili muzike preferirate? (Odaberite sve šta je primenjivo)";
export const post_q11_op1 = "1 Fikcija";
export const post_q11_op2 = "2 Non-fikcija";
export const post_q11_op3 = "3 Naučna fantastika";
export const post_q11_op4 = "4 Fantazija";
export const post_q11_op5 = "5 Misterija/Triler";
export const post_q11_op6 = "6 Romansa";
export const post_q11_op7 = "7 Istorijski";
export const post_q11_op8 = "8 Komedija";
export const post_q11_op9 = "9 Drama";
export const post_q11_op10 = "10 Akcija/Avantura";
export const post_q11_op11 = "11 Horor";
export const post_q11_op12 = "12 Dokumentarci";
export const post_q11_op13 = "13 Klasična muzika";
export const post_q11_op14 = "14 Pop";
export const post_q11_op15 = "15 Rok";
export const post_q11_op16 = "16 Džez";
export const post_q11_op17 = "17 Hip-hop/Rap";
export const post_q11_op18 = "18 Kantri";
export const post_q11_op19 = "19 Elektronska/Dens";
export const post_q11_op20 = "20 Svetska muzika";
export const post_q11_op21 = "21 Drugo:";

export const post_q12 = "Uživam u istraživanju novih kultura i kuhinja.";
export const post_q12_op1 = "1 U potpunosti se ne slažem";
export const post_q12_op2 = "2 Ne slažem se";
export const post_q12_op3 = "3 Ni slažem se ni ne slažem se";
export const post_q12_op4 = "4 Slažem se";
export const post_q12_op5 = "5 U potpunosti se slažem";

export const post_q13 = "12. Koje aktivnosti najviše volite u slobodno vreme? (Odaberite sve šta je primenjivo)";
export const post_q13_op1 = "1 Čitanje knjiga";
export const post_q13_op2 = "2 Gledanje filmova ili TV serija";
export const post_q13_op3 = "3 Igranje video igara";
export const post_q13_op4 = "4 Aktivnosti na otvorenom (npr. planinarenje, vožnja bicikla)";
export const post_q13_op5 = "5 Putovanja";
export const post_q13_op6 = "6 Kuvanje ili pečenje";
export const post_q13_op7 = "7 Umetnost i zanati";
export const post_q13_op8 = "8 Slušanje ili sviranje muzike";
export const post_q13_op9 = "9 Sport ili fitnes";
export const post_q13_op10 = "10 Druženje sa prijateljima i porodicom";
export const post_q13_op11 = "11 Drugo:";

export const post_q14 = "Strastven/a sam u vezi sa pitanjima zaštite životne sredine i održivosti.";
export const post_q14_op1 = "1 U potpunosti se ne slažem";
export const post_q14_op2 = "2 Ne slažem se";
export const post_q14_op3 = "3 Ni slažem se ni ne slažem se";
export const post_q14_op4 = "4 Slažem se";
export const post_q14_op5 = "5 U potpunosti se slažem";

export const post_q15 = "13. Koje izvore vesti redovno koristite? (Odaberite sve šta je primenjivo)";
export const post_q15_op1 = "1 Tradicionalne novine i časopisi";
export const post_q15_op2 = "2 Televizijske informativne emisije";
export const post_q15_op3 = "3 Onlajn veb-sajtovi sa vestima";
export const post_q15_op4 = "4 Platforme društvenih medija";
export const post_q15_op5 = "5 Blogovi i nezavisni informativni sajtovi";
export const post_q15_op6 = "6 Radio informativne emisije";
export const post_q15_op7 = "7 Podcasti";
export const post_q15_op8 = "8 Bilteni ili email pretplate";

export const post_q16 = "14. Koliko ste sigurni u svoju sposobnost da razlikujete prave od lažnih vesti?";
export const post_q16_op1 = "1 Uopšte nisam siguran/na";
export const post_q16_op2 = "2 Pomalo sam siguran/na";
export const post_q16_op3 = "3 Umjereno sam siguran/na";
export const post_q16_op4 = "4 Veoma sam siguran/na";
export const post_q16_op5 = "5 Izuzetno sam siguran/na";

export const post_q17 = "15. Koliko emocionalno snažno obično reagujete na vesti?";
export const post_q17_op1 = "1 Uopšte ne reagujem";
export const post_q17_op2 = "2 Blago reagujem";
export const post_q17_op3 = "3 Umjereno reagujem";
export const post_q17_op4 = "4 Snažno reagujem";
export const post_q17_op5 = "5 Veoma snažno reagujem";

export const post_q18 = "16. U kojoj meri se slažete sa sledećom izjavom: Smatram da moje političke stavove mogu uticati na odluke vlade.";
export const post_q18_op1 = "1 U potpunosti se ne slažem";
export const post_q18_op2 = "2 Ne slažem se";
export const post_q18_op3 = "3 Ni slažem se ni ne slažem se";
export const post_q18_op4 = "4 Slažem se";
export const post_q18_op5 = "5 U potpunosti se slažem";

export const post_q19 = "17. Kako primarno koristite onlajn društvene mreže? (Odaberite sve šta je primenjivo)";
export const post_q19_op1 = "1 Za čitanje vesti i informisanje";
export const post_q19_op2 = "2 Za povezivanje sa prijateljima i porodicom";
export const post_q19_op3 = "3 Za deljenje svojih mišljenja i sadržaja";
export const post_q19_op4 = "4 Za praćenje javnih ličnosti ili poznatih osoba";
export const post_q19_op5 = "5 Za pridruživanje grupama ili zajednicama od interesa";
export const post_q19_op6 = "6 U svrhe zabave";

export const post_q20 = "18. Koliko ste komforni sa svakodnevnom upotrebom alata zasnovanim na veštačkoj inteligenciji?";
export const post_q20_op1 = "1 Veoma mi je neprijatno";
export const post_q20_op2 = "2 Pomalo mi je neprijatno";
export const post_q20_op3 = "3 Neutralan/na sam";
export const post_q20_op4 = "4 Pomalo mi je prijatno";
export const post_q20_op5 = "5 Veoma mi je prijatno";

export const post_info_2 = "Hvala Vam što ste aktivno koristili platformu TWON!";
export const post_info_3 = "U nastavku ćemo Vam postaviti nekoliko pitanja o Vašem iskustvu na TWON i Vašim ličnim preferencijama. Na kraju upitnika bićete preusmereni nazad na Bilendi kako biste primili svoju naknadu.";

export const post_q21 = "1. Koliko pouzdanim smatrate ove informacije? ";
export const post_q21_op1 = "1 Nimalo pouzdanim  ";
export const post_q21_op2 = "2";
export const post_q21_op3 = "3";
export const post_q21_op4 = "4";
export const post_q21_op5 = "5";
export const post_q21_op6 = "6";
export const post_q21_op7 = "7 Veoma pouzdanim";

export const post_q22 = "2. Koliko pouzdanim smatrate ove informacije? ";
export const post_q22_op1 = "1 Nimalo pouzdanim ";
export const post_q22_op2 = "2";
export const post_q22_op3 = "3";
export const post_q22_op4 = "4";
export const post_q22_op5 = "5";
export const post_q22_op6 = "6";
export const post_q22_op7 = "7 Veoma pouzdanim";

export const post_q23 = "3. Koliko tačnim smatrate ove informacije?";
export const post_q23_op1 = "1 Nimalo tačnim";
export const post_q23_op2 = "2";
export const post_q23_op3 = "3";
export const post_q23_op4 = "4";
export const post_q23_op5 = "5";
export const post_q23_op6 = "6";
export const post_q23_op7 = "7 Veoma tačnim";

export const post_q24 = "4. Koliko pouzdanim smatrate nalog koji je podelio ovu informaciju? ";
export const post_q24_op1 = "1 Nimalo pouzdanim";
export const post_q24_op2 = "2";
export const post_q24_op3 = "3";
export const post_q24_op4 = "4";
export const post_q24_op5 = "5";
export const post_q24_op6 = "6";
export const post_q24_op7 = "7 Veoma pouzdanim";

export const post_q24_0 = "U nastavku bismo želeli da saznamo nešto više o Vašim političkim i društvenim stavovima.";
export const post_q24_1 = "1. U politici se često govori o spektru 'levo' i 'desno'. Gde biste sebe smestili na ovoj skali od 'levo' do 'desno'? ";
export const post_q24_1_op1 = "1 Levo";
export const post_q24_1_op2 = "2";
export const post_q24_1_op3 = "3";
export const post_q24_1_op4 = "4";
export const post_q24_1_op5 = "5";
export const post_q24_1_op6 = "6";
export const post_q24_1_op7 = "7 Desno";

export const post_q24_2 = "2. Koliko ste lično zabrinuti zbog ruske invazije na Ukrajinu?";
export const post_q24_2_op1 = "1 Veoma zabrinut/a";
export const post_q24_2_op2 = "2";
export const post_q24_2_op3 = "3";
export const post_q24_2_op4 = "4";
export const post_q24_2_op5 = "5 Nimalo zabrinut/a";

export const post_q24_3_0 = "Kako ocenjujete sledeće izjave:";
export const post_q24_3 = "3. Ruska invazija na Ukrajinu predstavlja direktnu pretnju za celu Evropu.";
export const post_q24_3_op1 = "1 Nimalo se ne slažem";
export const post_q24_3_op2 = "2";
export const post_q24_3_op3 = "3";
export const post_q24_3_op4 = "4";
export const post_q24_3_op5 = "5 U potpunosti se slažem";

export const post_q24_4 = "4. Rusija je imala legitimne zabrinutosti za svoju bezbednost koje su opravdale njihove vojne akcije.";
export const post_q24_4_op1 = "1 Nimalo se ne slažem";
export const post_q24_4_op2 = "2";
export const post_q24_4_op3 = "3";
export const post_q24_4_op4 = "4";
export const post_q24_4_op5 = "5 U potpunosti se slažem";

export const post_q24_5 = "5. Ukrajina bi trebalo da učestvuje u mirovnim pregovorima samo ako je njena teritorijalna suverenost garantovana.";
export const post_q24_5_op1 = "1 Nimalo se ne slažem";
export const post_q24_5_op2 = "2";
export const post_q24_5_op3 = "3";
export const post_q24_5_op4 = "4";
export const post_q24_5_op5 = "5 U potpunosti se slažem";

export const post_q25_0 = "6. Koliko lično imate poverenja u sledeće institucije?";
export const post_q25 = "Prepoznate/tradicionalne/… medijske institucije koje za emitovanje uglavnom koriste TV i radio";
export const post_q25_op1 = "1 Uopšte im ne verujem";
export const post_q25_op2 = "2 Ne verujem im";
export const post_q25_op3 = "3 Delimično im verujem";
export const post_q25_op4 = "4 Prilično im verujem";
export const post_q25_op5 = "5 Potpuno im verujem";

export const post_q25_1 = "Naučne institucije kao što su univerziteti i instituti";
export const post_q25_1_op1 = "1 Uopšte im ne verujem";
export const post_q25_1_op2 = "2 Ne verujem im";
export const post_q25_1_op3 = "3 Delimično im verujem";
export const post_q25_1_op4 = "4 Prilično im verujem";
export const post_q25_1_op5 = "5 Potpuno im verujem";

export const post_q25_2 = "Državne institucije";
export const post_q25_2_op1 = "1 Uopšte im ne verujem";
export const post_q25_2_op2 = "2 Ne verujem im";
export const post_q25_2_op3 = "3 Delimično im verujem";
export const post_q25_2_op4 = "4 Prilično im verujem";
export const post_q25_2_op5 = "5 Potpuno im verujem";

export const post_q26_0 = "Zanima nas Vaše mišljenje o tehničkoj upotrebljivosti TWON-a.";
export const post_q26 = "19. Govoreći veoma uopšteno, kako biste ocenili dizajn TWON-a u smislu prilagođenosti korisnicima?";
export const post_q26_op1 = "1 Nije uopšte prilagođen korisnicima";
export const post_q26_op2 = "2";
export const post_q26_op3 = "3";
export const post_q26_op4 = "4";
export const post_q26_op5 = "5 Veoma je prilagođen korisnicima";

export const post_q27 = "20. Da li su se neki tehnički problemi pojavili tokom studije?";
export const post_q27_op1 = "1 Nije bilo nikakvih tehničkih problema";
export const post_q27_op2 = "2";
export const post_q27_op3 = "3";
export const post_q27_op4 = "4";
export const post_q27_op5 = "5 Ogromni tehnički problemi";

export const post_q28 = "21. Rekli ste da je bilo tehničkih problema tokom studije. Možete li ih opisati detaljnije?";

export const post_q29_0 = "Sada bismo želeli da saznamo kako ocenjujete sadržaj na TWON-u.";
export const post_q29 = "7. Osnovna stranica sa vestima (newsfeed) je bila";
export const post_q29_1_op1 = "1 Veoma negativna";
export const post_q29_1_op2 = "2";
export const post_q29_1_op3 = "3";
export const post_q29_1_op4 = "4";
export const post_q29_1_op5 = "5";
export const post_q29_1_op6 = "6";
export const post_q29_1_op7 = "7 Veoma pozitivna ";

export const post_q29_2_op1 = "1 Nije kredibilna";
export const post_q29_2_op2 = "2";
export const post_q29_2_op3 = "3";
export const post_q29_2_op4 = "4";
export const post_q29_2_op5 = "5";
export const post_q29_2_op6 = "6";
export const post_q29_2_op7 = "7 Kredibilna";

export const post_q29_3_op1 = "1 Nije značajna";
export const post_q29_3_op2 = "2";
export const post_q29_3_op3 = "3";
export const post_q29_3_op4 = "4";
export const post_q29_3_op5 = "5";
export const post_q29_3_op6 = "6";
export const post_q29_3_op7 = "7 Značajna";

export const post_q29_4_op1 = "1 Nije bitna za mene";
export const post_q29_4_op2 = "2";
export const post_q29_4_op3 = "3";
export const post_q29_4_op4 = "4";
export const post_q29_4_op5 = "5";
export const post_q29_4_op6 = "6";
export const post_q29_4_op7 = "7 Bitna za mene";

export const post_q29_5_op1 = "1 Nije aktuelna";
export const post_q29_5_op2 = "2";
export const post_q29_5_op3 = "3";
export const post_q29_5_op4 = "4";
export const post_q29_5_op5 = "5";
export const post_q29_5_op6 = "6";
export const post_q29_5_op7 = "7 Aktuelna";

export const post_q29_6_op1 = "1 Neprijateljska";
export const post_q29_6_op2 = "2";
export const post_q29_6_op3 = "3";
export const post_q29_6_op4 = "4";
export const post_q29_6_op5 = "5";
export const post_q29_6_op6 = "6";
export const post_q29_6_op7 = "7 Prijateljska";

export const post_q29_7_op1 = "1 Neinformativna";
export const post_q29_7_op2 = "2";
export const post_q29_7_op3 = "3";
export const post_q29_7_op4 = "4";
export const post_q29_7_op5 = "5";
export const post_q29_7_op6 = "6";
export const post_q29_7_op7 = "7 Informativna";

export const post_q42 = "Na kraju, da li postoji još nešto što biste želiti da nam kažete o studiji?";
