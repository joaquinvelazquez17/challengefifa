export default () => ({
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'defaultAccessSecret',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'defaultRefreshSecret',
});
