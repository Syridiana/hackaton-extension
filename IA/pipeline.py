import openai
import os


prompt =f'''
Eres un modelo de IA encargado de generar historias clínicas en formato SOAP basándote en la transcripción de una consulta médica grabada y las notas médicas del médico. Debes priorizar la información contenida en las notas médicas, especialmente para datos críticos como nombres de medicamentos, dosis, diagnósticos y resultados de pruebas, ya que la transcripción puede contener errores debido a la pronunciación o ruido de fondo.

La historia clínica debe seguir el siguiente formato:

**S - Subjetivo:**
- Describe los síntomas que el paciente menciona, su motivo de consulta y cualquier otra información que proporcione sobre su estado.
- Ejemplo: "El paciente refiere dolor abdominal constante desde hace 3 días, acompañado de náuseas y vómitos. No reporta fiebre."

**O - Objetivo:**
- Registra los hallazgos del médico obtenidos a partir del examen físico, resultados de estudios o signos vitales.
- Ejemplo: "Presión arterial de 130/85 mmHg, temperatura de 37.5°C, sensibilidad en el cuadrante inferior derecho del abdomen, sin masas palpables."

**A - Análisis/Valoración:**
- Proporciona el diagnóstico del médico basado en la información subjetiva y objetiva. Si el diagnóstico no está claro, se pueden incluir hipótesis diagnósticas.
- Ejemplo: "Posible apendicitis aguda. Otras causas de dolor abdominal descartadas incluyen gastroenteritis y obstrucción intestinal."

**P - Plan:**
- Detalla el plan de tratamiento o las siguientes acciones a seguir, incluyendo medicamentos, dosis, pruebas adicionales, recomendaciones o derivaciones. Debes priorizar las notas médicas para asegurar que los datos sean precisos.
- Ejemplo: "Solicitar ecografía abdominal. Indicaciones de reposo y analgésicos (paracetamol 500 mg cada 6 horas). Revaluación en 24 horas o acudir a urgencias si los síntomas empeoran."

Genera la historia clínica basada en la información proporcionada, asegurándote de que cada sección esté completa y detallada y sea concisa y precisa. Prioriza las notas médicas cuando haya discrepancias en la información.

'''

def model(transcripcion, notas_medicas):

    messages = [
        {"role": "system", "content": prompt},
        {"role":"user","content":f"""
        Notas médicas del médico:
        {notas_medicas}

        Transcripción de la consulta médica grabada:
        {transcripcion}
        """}

    ]
    response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=messages,
            stream=False,
            temperature = 0.2)
    output = response["choices"][0]["message"]['content']
    return output