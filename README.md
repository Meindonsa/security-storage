# @security-storage

SECURE-STORAGE is a lite library that purpose is to encrypt your data and store it in localStorage.

####

Library use `Crypto-js` to encrypt you data, `Lz-string` to compress data encrypted and save it in localStorage with native JavaScript `localStorage`

## Requirements

- [Crypto-js](https://www.npmjs.com/package/crypto-js)
- [LZ-String](https://www.npmjs.com/package/lz-string)

## Installation

```bash
npm @meindonsa/security-storage --save
```

## Usage

#### Import service in your service or component

```typescript
import SecurityStorage from "@meindonsa/security-storage";
...

securityStorage = new SecurityStorage();
```

then, you can use differents methods of service:

- set

`set` encrypts your data and saves it in specified key and in localStorage. If the key is not provided, the library will warn. Following types of JavaScript objects are supported: `Array`, `Blob`,`Float`,`Number`, `Object` ,`String`

| Parameter               | Description                        |
| :---------------------- | :--------------------------------- |
| `key`                   | key to store data in localStorage  |
| `data`                  | data to store                      |

###

- get

`get` gets data back from specified key from the localStorage library. If the key is not provided, the library will warn.

| Parameter               | Description                        |
| :---------------------- | :--------------------------------- |
| `key`                   | key to get data from localStorage  |
| `encryption_secret_key` | your key used to decrypt your data |

###

- remove

`remove` removes the value of a key from the localStorage.

| Parameter | Description                                          |
| :-------- | :--------------------------------------------------- |
| `key`     | key to identify data and remove it from localStorage |

###

- clean

`clean` remove all your data from the localStorage, this method don't take parameter

### Example

eg :

```typescript

import SecurityStorage from "@meindonsa/security-storage";
...

securityStorage = new SecurityStorage();

saveData() {
    this.securityStorage.set(key, data);
}

getData() {
    return this.securityStorage.get(key);
}

remove() {
    this.securityStorage.remove(key);
}

removeAll() {
    this.securityStorage.clean();
}

```

## Authors

- [@Meindonsa](https://github.com/Meindonsa)

## Support

For support, email borisaxel1998@gmail.com
