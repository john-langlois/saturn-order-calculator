
export function checkEmployeeExists(){
  let emp = sessionStorage.getItem('currentEmployee');
  if(!emp){
    return null;
  }
  return JSON.parse(emp);
}



export function formatDateyyyymmdd(date: Date | string | null) {
  if (date === null) {
    return null;
  }

  const newDate = new Date(date);

  const year = newDate.getFullYear();
  const month = newDate.getMonth();
  const day = newDate.getDate();

  const dateString = year + "-" +
    (month + 1).toLocaleString(undefined, { minimumIntegerDigits: 2 }) + "-" +
    day.toLocaleString(undefined, { minimumIntegerDigits: 2 });

  return dateString;
}

export function formatDateTime(date: Date ) {
  if (date === null) {
    return null;
  }

  const newDate = new Date(date);
  return date.toLocaleString();
}

export function returnAsButton(param:any){
  switch(param){
    case("Under Review"):
      return `<button class="btn form-control btn-warning">${param}</button>`;

      case("Approved"):
      return `<button class="btn form-control btn-success">${param}</button>`;

      case("Rejected"):
      return `<button class="btn form-control btn-danger">${param}</button>`;

      case("Pending PO"):
      return `<button class="btn form-control btn-teal text-white">${param}</button>`;

      case("Pending Reconciliation"):
      return `<button class="btn form-control btn-orange text-white">${param}</button>`;

      case("Pending Crib"):
      return `<button class="btn form-control btn-indigo text-white">${param}</button>`;

      case("Completed"):
      return `<button class="btn form-control btn-blue text-white">${param}</button>`;

      default:
      return `<button class="btn form-control btn-secondary">${param}</button>`;
  }
}



export async function createObjectURL(stream:any) {
  const blob = new Blob([stream], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
}

export function revokeObjectURL(url: string) {
  URL.revokeObjectURL(url);
}

export function checkEmployeeIsAdmin(){
  let emp = sessionStorage.getItem("currentEmployee");
  if(emp){
    let isAdmin = JSON.parse(emp).isAdmin;
    return isAdmin;
  }
}

export function renderFileButton(file:string){
  return `<a href="${file}" class="btn btn-primary" target="_blank">View File</a>`
}

export function renderPhoto(photo:string){
  return `<img src="${photo}" style="width:150px;height:100px;"/>`
}
