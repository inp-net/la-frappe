export async function post(request: Request) {
    const body = await request.json();
    const { name, filiereId } = body;

    // logique :
    // 1. Vérifier si la filière existe
    // 2. Créer le dossier physique
    console.log('Création de la matière ${name} dans la filiere ${filiere_id}');

    return new Response(JSON.stringify({ message: "Matière créée "}), { status : 201 });
}