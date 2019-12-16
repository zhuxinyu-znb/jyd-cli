function getNowFormatDate() {
  const date = new Date();
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  let hours = buling(date.getHours());
  let minutes = buling(date.getMinutes());
  let seconds = buling(date.getSeconds());
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  const currentdate = `${date.getFullYear()}-${month}-${strDate} ${hours}:${minutes}:${seconds}`;
  // return currentdate;
  return "2019-11-30 10:10:00";
}
const buling = data => {
  if (data < 10) {
    return `0${data}`;
  }
  return data;
};

export default getNowFormatDate;
