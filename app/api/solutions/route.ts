import { NextResponse } from "next/server";
import * as admin from "firebase-admin";

let firestoreInstance: FirebaseFirestore.Firestore | null = null;

function getFirestore() {
  if (!admin.apps.length) {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "{}"
    );
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
    });
  }
  
  if (!firestoreInstance) {
    firestoreInstance = admin.firestore();
    firestoreInstance.settings({ databaseId: "crud" });
  }
  
  return firestoreInstance;
}

export async function POST(req: Request) {
  try {
    const { problemId, username, solutionLink } = await req.json();

    if (!problemId || !username || !solutionLink) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const db = getFirestore();
    const docId = `${problemId}_${username}`;
    const solutionRef = db.collection("solutions").doc(docId);

    const existingDoc = await solutionRef.get();
    const createdAt = existingDoc.exists ? existingDoc.data()?.createdAt : admin.firestore.FieldValue.serverTimestamp();

    await solutionRef.set({
      problemId: String(problemId),
      username,
      solutionLink,
      createdAt,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const solution = (await solutionRef.get()).data();

    return NextResponse.json(solution, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error: any) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const problemId = searchParams.get("problemId");

  if (!problemId) {
    return NextResponse.json({ error: "problemId required" }, { 
      status: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  const db = getFirestore();
  const snapshot = await db
    .collection("solutions")
    .where("problemId", "==", problemId)
    .orderBy("createdAt", "desc")
    .get();

  const solutions = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      username: data.username,
      solutionLink: data.solutionLink,
      createdAt: data.createdAt,
    };
  });

  return NextResponse.json(solutions, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function OPTIONS(req: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}


