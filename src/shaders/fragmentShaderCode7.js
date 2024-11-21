export const fragmentShaderCode = `
#ifdef GL_ES
precision highp float;
#endif

uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;

// Uniform per als paràmetres interactius
uniform float a;
uniform float b;
uniform float m;
uniform float n;

varying vec2 vTexCoord;

#define PI 3.14159265359

// Valors del vector de fase
float p1 = 1.0;
float p2 = 1.0;
float p3 = -1.0;
float p4 = -1.0;

// Funció de patrons de Chladni
float Chladni(float a, float b, float m, float n, vec4 p, vec2 z, float t) {
    float v1 = a * sin(PI * n * z.x + p.x * t) * sin(PI * m * z.y + p.y * t);
    float v2 = b * sin(PI * m * z.x + p.z * t) * sin(PI * n * z.y + p.w * t);
    return v1 + v2;
}

// Mapeig de valors
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

// Nova paleta de colors
vec3 customPalette(float t) {
    vec3 abstractBase = vec3(0.2, 0.1, 0.3); // Morat fosc
    vec3 highlight = vec3(0.8, 0.6, 0.2); // Tons càlids
    vec3 modulator = vec3(0.4, 0.6, 0.2); // Modulador abstracte
    vec3 phaseShift = vec3(0.1, 0.3, 0.2); // Desplaçament abstracte
    return abstractBase + highlight * sin(2.0 * PI * (modulator * t + phaseShift));
}

void main() {
    vec2 uv = vTexCoord * 2.0 - 1.0; // Coordenades normalitzades
    uv.x *= iResolution.x / iResolution.y; // Ajust per aspect ratio

    // Vector de fase
    vec4 po = vec4(p1, p2, p3, p4);

    // Càlcul del patró
    float col = Chladni(a, b, m, n, po, uv, iTime * 0.3);

    // Mapeig del valor de color
    float c1 = map(col, -1.0, 1.0, 0.0, 1.0);

    // Color final
    gl_FragColor = vec4(customPalette(c1), 1.0); // Utilitzem la nova paleta
}
`;
