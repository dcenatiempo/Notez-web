--
-- Tables
--
DROP TABLE public.note;
DROP TABLE public.notebook;
DROP TABLE public."user";
DROP TABLE public."session";

CREATE TABLE public."user" (
     id       SERIAL       NOT NULL
    ,email    VARCHAR(128) NOT NULL
    ,data     JSONB        NOT NULL
);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);

CREATE TABLE public.notebook (
     id          SERIAL       NOT NULL
    ,data        JSONB        NOT NULL
    ,userid      INTEGER      NOT NULL
);
ALTER TABLE ONLY public.notebook
    ADD CONSTRAINT notebook_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.notebook
    ADD CONSTRAINT notebook_userid_fkey FOREIGN KEY (userid) REFERENCES public."user"(id);

CREATE TABLE public.note (
     id          SERIAL       NOT NULL
    ,data        JSONB        NOT NULL
    ,notebookid  INTEGER      NOT NULL
    ,userid      INTEGER      NOT NULL
);
ALTER TABLE ONLY public.note
    ADD CONSTRAINT note_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.note
    ADD CONSTRAINT note_userid_fkey FOREIGN KEY (userid) REFERENCES public."user"(id);
ALTER TABLE ONLY public.note
    ADD CONSTRAINT note_notebookid_fkey FOREIGN KEY (notebookid) REFERENCES public.notebook(id) ON DELETE CASCADE;

CREATE TABLE public."session" (
    "sid" VARCHAR          NOT NULL COLLATE "default"
    ,"sess" JSON           NOT NULL
    ,"expire" TIMESTAMP(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- Permissions
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO public;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO public;