-- Fonction PostgreSQL pour créer un client avec privilèges élevés
CREATE OR REPLACE FUNCTION create_new_client(
  p_firebase_uid text,
  p_email text DEFAULT '',
  p_nom text DEFAULT '',
  p_prenom text DEFAULT ''
) 
RETURNS json 
LANGUAGE plpgsql 
SECURITY DEFINER -- Cette fonction s'exécute avec les privilèges du propriétaire (pas de l'utilisateur)
SET search_path = public
AS $$
DECLARE
  new_client json;
  existing_client_count integer;
BEGIN
  -- Vérifier si le client existe déjà
  SELECT COUNT(*) INTO existing_client_count
  FROM client_db 
  WHERE firebase_uid = p_firebase_uid;
  
  IF existing_client_count > 0 THEN
    -- Retourner le client existant
    SELECT row_to_json(c.*) INTO new_client
    FROM client_db c
    WHERE c.firebase_uid = p_firebase_uid;
    
    RETURN json_build_object(
      'success', true,
      'message', 'Client already exists',
      'data', new_client
    );
  END IF;
  
  -- Créer un nouveau client
  INSERT INTO client_db (
    firebase_uid, 
    email, 
    nom, 
    prenom, 
    role,
    created_at
  ) VALUES (
    p_firebase_uid, 
    p_email, 
    p_nom, 
    p_prenom, 
    'client',
    NOW()
  )
  RETURNING row_to_json(client_db.*) INTO new_client;
  
  RETURN json_build_object(
    'success', true,
    'message', 'Client created successfully',
    'data', new_client
  );
  
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object(
    'success', false,
    'message', SQLERRM,
    'error_code', SQLSTATE
  );
END;
$$;

-- Donner les permissions d'exécution à tous les utilisateurs authentifiés
GRANT EXECUTE ON FUNCTION create_new_client(text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION create_new_client(text, text, text, text) TO anon;