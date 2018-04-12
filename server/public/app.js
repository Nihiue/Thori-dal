function output(str) {
  const el = document.querySelector('textarea');
  el.value = el.value + str + '\n\n';
}

function getAccessToken(origToken = '733faa1305664c08bb42860a3ebd608f', salt = '1db750dc352f4128810d6ac77a18a33b') {
  const now = Date.now();
  const timeSlot = now - (now % 60000);
  let hash = CryptoJS.SHA256(`${origToken}|${salt}|${timeSlot}`).toString();
  return hash;
}

function getHeader() {
  return {
    'X-Thoridal-Atk': getAccessToken(),
    'X-Thoridal-User': 'test'
  };
}

async function testCreateUser() {
  const res = await axios({
    method: 'post',
    url: '/users',
    headers: getHeader(),
    data: {
      Name: 'newU2sser',
      Token: 'asdasdw3dc',
      Email: 'xsa2q@q.com'
    }
  });
  output(JSON.stringify(res.data, null, 2));
}

async function testCreateRecord() {
  const res = await axios({
    method: 'post',
    url: '/records',
    headers: getHeader(),
    data: {
      Name: 'newU2sser',
      Data: 'data'
    }
  });
  output(JSON.stringify(res.data, null, 2));
}

async function testPutRecord() {
  const res = await axios({
    method: 'put',
    url: '/records/5acf6fc1d626e22d1c98ede7',
    headers: getHeader(),
    data: {
      Name: 'newU2sserM',
      Data: 'dataM'
    }
  });
  output(JSON.stringify(res.data, null, 2));
}


async function testGetRecord() {
  const res = await axios({
    method: 'get',
    url: '/records/5acf6fc1d626e22d1c98ede7',
    headers: getHeader()
  });
  output(JSON.stringify(res.data, null, 2));
}


async function testDeleteRecord() {
  const res = await axios({
    method: 'delete',
    url: '/records/5acf6fc1d626e22d1c98ede7',
    headers: getHeader()
  });
  output(JSON.stringify(res.data, null, 2));
}

async function testListRecord() {
  const res = await axios({
    method: 'get',
    url: '/records',
    headers: getHeader()
  });
  output(JSON.stringify(res.data, null, 2));
}

testListRecord()