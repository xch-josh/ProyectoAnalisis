const API_URL = 'https://localhost:44355/Rol';

export async function GetRoles() {
    try {

        const response = await fetch(API_URL, {//SOLICITUD AL SERVIDOR
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response !== false) {//VALIDAR RESUPUESTA DEL SERVIDOR
            return await response.json();
        }
        else {
            return false
        }
    } catch (error) {
        console.error(error);
    }
}

export async function GetRol(id) {
  try {
    const response = await fetch(API_URL + '/' + id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    if (response !== false) {//VALIDAR RESUPUESTA DEL SERVIDOR
      const data = await response.json();

      return data;
    }
    else {
      return false
    }
  } catch (error) {
    console.error(error);
  }
}

export async function Insert(data) {
  try {
    const requestBody = JSON.stringify(data);

    const response = await fetch(API_URL, {//SOLICITUD AL SERVIDOR
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: requestBody
    });

    return response.json();

  } catch (error) {
    console.error(error);
  }
}

export async function Edit(data) {
  try {
    const requestBody = JSON.stringify(data);

    const response = await fetch(API_URL, {//SOLICITUD AL SERVIDOR
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: requestBody
    });

    return response.json();

  } catch (error) {
    console.error(error);
  }
}

export async function Delete(id) {
  try {
    const response = await fetch(API_URL + '/' + id, {//SOLICITUD AL SERVIDOR
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: ''
    });

    return response.json();

  } catch (error) {
    console.error(error);
  }
}


export async function GetAccess(rolID) {
    try {

        const response = await fetch(API_URL + '/Access/' + rolID, {//SOLICITUD AL SERVIDOR
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response !== false) {//VALIDAR RESUPUESTA DEL SERVIDOR
            return await response.json();
        }
        else {
            return false
        }
    } catch (error) {
        console.error(error);
    }
}

export async function GetModuleAccess(rolID) {
    try {

        const response = await fetch(API_URL + '/ModuleAccess/' + rolID, {//SOLICITUD AL SERVIDOR
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response !== false) {//VALIDAR RESUPUESTA DEL SERVIDOR
            return await response.json();
        }
        else {
            return false
        }
    } catch (error) {
        console.error(error);
    }
}

export async function UpdateModuleAccess(rolID, data) {
    try {
        let requestBody = JSON.stringify(data);
        const response = await fetch(API_URL + '/ModuleAccess/' + rolID, {//SOLICITUD AL SERVIDOR
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: requestBody
        });

        if (response !== false) {//VALIDAR RESUPUESTA DEL SERVIDOR
            return await response.json();
        }
        else {
            return false
        }
    } catch (error) {
        console.error(error);
    }
}