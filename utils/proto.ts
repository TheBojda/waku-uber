import protons from 'protons';

export const proto = protons(`
enum Type {
    REQUEST = 1;
    RESPONSE = 2;
}

message WakuUberMessage {
    Type type = 1;
    float lat = 2;
    float lng = 3;
    string avatarHash = 4;
}
`);