export interface JwtPayLoad {

    id: string;     // Id del Usuario
    iat?: number;   // Fecha de creación, opcional
    exp?: number;   // Fecha de expiración, opcional

}