# JWT (Json web Token)

| Path    | Method | Req Body / Req Header              | Response                                                          | Description                                         |
|---------|--------|------------------------------------|-------------------------------------------------------------------|-----------------------------------------------------|
| /login  | POST   | {"email": **email**}               | {"accessToken": **accessToken**, "refreshToken":**refreshToken**} | Generate access token, refresh token and log in     |
| /data   | GET    | Authorization: Bearer **TOKEN**    | {"name": **name**, "gender": **gender**, "age": **age**}          | Get data based on authorized credential             |
| /token  | POST   | {"refreshToken": **refreshToken**} | {"accessToken": **accessToken**}                                  | Generate new access token after expire              |
| /logout | DELETE | {"refreshToken": **refreshToken**} | --                                                                | Delete the refresh token not to reuse multiple time |

## Reference
- [JWT](https://www.youtube.com/watch?v=7Q17ubqLfaM)
- [JWT Authorization - nodejs-express](https://www.youtube.com/watch?v=mbsmsi7l3r4)