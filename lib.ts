export async function getArchivedUrl(url: string) {
  const submitId = await getSubmitId();
  return archiveUrl(url, submitId);
}

const headers = { "User-Agent": "deno" };

// getSubmitId makes a GET request to archive.is and extracts the submitid value
async function getSubmitId() {
  const response = await fetch("https://archive.is", { headers });
  const body = await response.text();

  console.log("has submitid?: ", body.includes("submitid"));

  const submitIdMatch = body.match(/name="submitid"\s+value="(.*?)"/);
  if (submitIdMatch && submitIdMatch[1]) {
    return submitIdMatch[1];
  } else {
    throw new Error("Could not find submitid");
  }
}

// archiveUrl makes a POST request to archive.is/submit with the provided URL and submitid
async function archiveUrl(url: string, submitid: string) {
  const params = new URLSearchParams({ url, anyway: "1", submitid });
  const response = await fetch(
    `https://archive.is/submit/?${params.toString()}`,
    { headers }
  );

  if (!response.ok) {
    throw new Error(
      `Request failed! (${response.status}) ${await response.text()}`
    );
  }

  const locationHeader = response.headers.get("location");
  if (locationHeader) return response.headers.get("location");

  const refreshHeader = response.headers.get("refresh");
  if (refreshHeader) return refreshHeader.split(";url=")[1];

  throw new Error("No Location or refresh headers found");
}
