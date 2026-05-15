import printStyles from "../../styles/DashboardPages/ClassResultPrint.css?inline";
import type {
  ResultFilters,
  ResultListItem,
} from "../../types/ClassBasedResult";
export const getClassPrintHTML = (
  results: ResultListItem[],
  filters: ResultFilters,
) => {
  const tableRows = results
    .map((result, idx) => {
      // Logic for Position display
      let positionDisplay = "";
      if (result.isFailed || result.grade === "F") {
        positionDisplay = "ফেল";
      } else if (result.position === 1) {
        positionDisplay = "🥇 ১ম";
      } else if (result.position === 2) {
        positionDisplay = "🥈 ২য়";
      } else if (result.position === 3) {
        positionDisplay = "🥉 ৩য়";
      } else {
        positionDisplay = `${result.position} তম`;
      }

      return `
      <tr>
        <td>${idx + 1}</td>
        <td style="text-align: left;">${result.studentName}</td>
        <td>${result.studentRoll}</td>
        <td>${result.totalObtained}/${result.totalMax}</td>
        <td>${result.percentage}%</td>
        <td><span class="badge ${result.grade === "F" ? "fail" : "pass"}">${result.grade}</span></td>
        <td>${result.gpa}</td>
        <td>${positionDisplay}</td>
      </tr>
    `;
    })
    .join("");
  return `
    <html>
      <head>
        <title>Class Result - ${filters.className}</title>
        <style>${printStyles}</style>
      </head>
      <body>
        <img src="/logob.png" class="watermark" alt="watermark">

        <div class="school-header">
        
          <img src="/logob.png" class="header-logo" alt="School Logo"> <div class="header-text">
            <h1>শাহ নেয়ামত (রহ:) কেজি এন্ড হাই স্কুল</h1>
            <p>১নং বোর্ড বাজার, চরলক্ষ্যা, কর্ণফুলী, চট্টগ্রাম</p>
            <p><strong>${results[0].examName}</strong> Exam: ${filters.academicYear}</p>
          </div>
        </div>

        <h2 style="text-align: center;">শ্রেণী ভিত্তিক ফলাফল তালিকা(<strong>শ্রেণী: </strong> ${filters.className})</h2>

        <table class="result-table">
          <thead>
            <tr>
              <th>#</th>
              <th>শিক্ষার্থীর নাম</th>
              <th>রোল</th>
              <th>প্রাপ্ত নম্বর</th>
              <th>শতকরা</th>
              <th>গ্রেড</th>
              <th>জিপিএ</th>
              <th>অবস্থান</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <div style="margin-top: 50px; display: flex; justify-content: space-between;">
           <p style="border-top: 1px solid #000; width: 150px; text-align: center;">শ্রেণী শিক্ষকের স্বাক্ষর</p>
           <p style="border-top: 1px solid #000; width: 150px; text-align: center;">প্রধান শিক্ষকের স্বাক্ষর</p>
        </div>
      </body>
    </html>
  `;
};
