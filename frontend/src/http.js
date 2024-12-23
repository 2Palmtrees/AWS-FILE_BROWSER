const backendUrl = 'http://localhost:3000/'

export async function getObjects({ delimiter = '/', prefix = '' }) {
  const queryString = `delimiter=${delimiter}&prefix=${prefix}`
  const response = await fetch(
    backendUrl + `s3?` + queryString
  );
  const resData = await response.json();

  // console.log(resData);

  if (!response.ok) {
    throw new Error('Failed to fetch S3 Data');
  }
  return resData
}

export async function uploadObject(formData) {
  const response = await fetch(backendUrl + 's3', {
    method: 'POST',
    body: formData
  })
  const resData = await response.json();

  console.log(resData);

  if (!response.ok && (response.status === 422 || response.status === 409 )) {
    return resData;
  }

  if (!response.ok) {
    throw new Error('Failed to upload to s3');
  }
  return resData
}

export async function deleteObject(key) {
  const response = await fetch(backendUrl + 's3', {
    method: 'DELETE',
    body: JSON.stringify({ key }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || 'Failed to delete object');
  }
  return resData
}