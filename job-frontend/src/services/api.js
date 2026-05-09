const BASE = "https://localhost:7227/api";

//method : get, post, put, delete
//path : endpoint like /jobs
const req = async (method, path, body) => {
   const token = localStorage.getItem("token")
  
  const res = await fetch(`${BASE}${path}`, {
    method,
    //tells sending the json data
    headers: {
      "Content-Type": "application/json",
      // attach token automatically if exists
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    //convert to json
    body: body ? JSON.stringify(body) : undefined,
  });

  //if request fails
  // handle error response
  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new Error(err?.message || "Request failed")
  }

  //handle empty response like delete
  //Request was successful, but there is NO data to send back
  if(res.status === 204) return null;

  return res.json();

};
export default req
