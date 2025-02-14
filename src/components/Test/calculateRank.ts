
import { IndexedQuestion } from "./TestView";

export const calculateRank = (
  marks: number,
  examType: "JEE" | "NEET",
  questions: IndexedQuestion[]
): string => {
  const maxMarks = questions.length * 4; // 40 marks total (10 questions × 4 marks)
  const percentage = (marks / maxMarks) * 100;

  if (examType === "JEE") {
    // JEE Mains mapping (converting our 80 marks scale to 300 marks scale)
    if (percentage >= 97) return "12-19"; // ~290/300
    if (percentage >= 95) return "20-50"; // ~285/300
    if (percentage >= 93) return "51-100"; // ~280/300
    if (percentage >= 90) return "101-200"; // ~270/300
    if (percentage >= 87) return "201-500"; // ~260/300
    if (percentage >= 83) return "501-1,000"; // ~250/300
    if (percentage >= 80) return "1,001-2,000"; // ~240/300
    if (percentage >= 77) return "2,001-3,500"; // ~230/300
    if (percentage >= 73) return "3,501-5,000"; // ~220/300
    if (percentage >= 70) return "5,001-7,000"; // ~210/300
    if (percentage >= 67) return "7,001-10,000"; // ~200/300
    if (percentage >= 63) return "10,001-15,000"; // ~190/300
    if (percentage >= 60) return "15,001-20,000"; // ~180/300
    if (percentage >= 57) return "20,001-25,000"; // ~170/300
    if (percentage >= 53) return "25,001-30,000"; // ~160/300
    if (percentage >= 50) return "30,001-40,000"; // ~150/300
    if (percentage >= 47) return "40,001-50,000"; // ~140/300
    if (percentage >= 43) return "50,001-60,000"; // ~130/300
    if (percentage >= 40) return "60,001-70,000"; // ~120/300
    if (percentage >= 37) return "70,001-80,000"; // ~110/300
    if (percentage >= 33) return "80,001-90,000"; // ~100/300
    if (percentage >= 30) return "90,001-100,000"; // ~90/300
    return "100,000+";
  } else {
    // NEET mapping (converting our 80 marks scale to 720 marks scale)
    if (percentage >= 99) return "1";
    if (percentage >= 97) return "2-19"; // ~715/720
    if (percentage >= 95) return "20-50"; // ~710/720
    if (percentage >= 93) return "51-100"; // ~705/720
    if (percentage >= 90) return "101-200"; // ~700/720
    if (percentage >= 87) return "201-500"; // ~690/720
    if (percentage >= 85) return "501-1,000"; // ~680/720
    if (percentage >= 83) return "1,001-2,000"; // ~670/720
    if (percentage >= 80) return "2,001-3,000"; // ~660/720
    if (percentage >= 77) return "3,001-5,000"; // ~650/720
    if (percentage >= 75) return "5,001-7,000"; // ~640/720
    if (percentage >= 73) return "7,001-10,000"; // ~630/720
    if (percentage >= 70) return "10,001-15,000"; // ~620/720
    if (percentage >= 67) return "15,001-20,000"; // ~610/720
    if (percentage >= 65) return "20,001-25,000"; // ~600/720
    if (percentage >= 63) return "25,001-30,000"; // ~590/720
    if (percentage >= 60) return "30,001-35,000"; // ~580/720
    if (percentage >= 57) return "35,001-40,000"; // ~570/720
    if (percentage >= 55) return "40,001-45,000"; // ~560/720
    if (percentage >= 53) return "45,001-50,000"; // ~550/720
    if (percentage >= 50) return "50,001-60,000"; // ~540/720
    if (percentage >= 47) return "60,001-70,000"; // ~530/720
    if (percentage >= 45) return "70,001-80,000"; // ~520/720
    if (percentage >= 43) return "80,001-90,000"; // ~510/720
    if (percentage >= 40) return "90,001-100,000"; // ~500/720
    return "100,000+";
  }
};
