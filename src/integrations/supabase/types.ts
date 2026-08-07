export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          subtitle: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          subtitle?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          subtitle?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      activity_comments: {
        Row: {
          activity_id: string
          author_name: string
          body: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          activity_id: string
          author_name: string
          body: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          activity_id?: string
          author_name?: string
          body?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_comments_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_likes: {
        Row: {
          activity_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          activity_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          activity_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_likes_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      app_notifications: {
        Row: {
          body: string
          created_at: string
          data: Json
          delivered_at: string | null
          id: string
          kind: string
          title: string
          url: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          data?: Json
          delivered_at?: string | null
          id?: string
          kind: string
          title: string
          url?: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          data?: Json
          delivered_at?: string | null
          id?: string
          kind?: string
          title?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      bible_bookmarks: {
        Row: {
          book: number
          chapter: number
          created_at: string
          id: string
          label: string | null
          updated_at: string
          user_id: string
          verse: number
        }
        Insert: {
          book: number
          chapter: number
          created_at?: string
          id?: string
          label?: string | null
          updated_at?: string
          user_id: string
          verse?: number
        }
        Update: {
          book?: number
          chapter?: number
          created_at?: string
          id?: string
          label?: string | null
          updated_at?: string
          user_id?: string
          verse?: number
        }
        Relationships: []
      }
      bible_favorites: {
        Row: {
          book: number
          chapter: number
          created_at: string
          id: string
          updated_at: string
          user_id: string
          verse: number
        }
        Insert: {
          book: number
          chapter: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
          verse: number
        }
        Update: {
          book?: number
          chapter?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          verse?: number
        }
        Relationships: []
      }
      bible_highlights: {
        Row: {
          book: number
          chapter: number
          color: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
          verse: number
        }
        Insert: {
          book: number
          chapter: number
          color?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
          verse: number
        }
        Update: {
          book?: number
          chapter?: number
          color?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          verse?: number
        }
        Relationships: []
      }
      bible_notes: {
        Row: {
          book: number
          chapter: number
          content: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
          verse: number
        }
        Insert: {
          book: number
          chapter: number
          content: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
          verse: number
        }
        Update: {
          book?: number
          chapter?: number
          content?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          verse?: number
        }
        Relationships: []
      }
      bible_reading_progress: {
        Row: {
          book: number
          chapter: number
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          book: number
          chapter: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          book?: number
          chapter?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      challenges: {
        Row: {
          accepted_at: string | null
          challenged_id: string
          challenger_id: string
          completion_bonus_awarded: boolean
          created_at: string
          first_finished_at: string | null
          first_finisher_id: string | null
          id: string
          scope_id: string
          scope_type: string
          second_finished_at: string | null
          status: string
          winner_bonus_awarded: boolean
        }
        Insert: {
          accepted_at?: string | null
          challenged_id: string
          challenger_id: string
          completion_bonus_awarded?: boolean
          created_at?: string
          first_finished_at?: string | null
          first_finisher_id?: string | null
          id?: string
          scope_id: string
          scope_type: string
          second_finished_at?: string | null
          status?: string
          winner_bonus_awarded?: boolean
        }
        Update: {
          accepted_at?: string | null
          challenged_id?: string
          challenger_id?: string
          completion_bonus_awarded?: boolean
          created_at?: string
          first_finished_at?: string | null
          first_finisher_id?: string | null
          id?: string
          scope_id?: string
          scope_type?: string
          second_finished_at?: string | null
          status?: string
          winner_bonus_awarded?: boolean
        }
        Relationships: []
      }
      character_game_answers: {
        Row: {
          answer_hash: string
          is_correct: boolean
          is_locked: boolean
          received_at: string
          round_id: string
          user_id: string
        }
        Insert: {
          answer_hash: string
          is_correct?: boolean
          is_locked?: boolean
          received_at?: string
          round_id: string
          user_id: string
        }
        Update: {
          answer_hash?: string
          is_correct?: boolean
          is_locked?: boolean
          received_at?: string
          round_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_game_answers_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "character_game_rounds"
            referencedColumns: ["id"]
          },
        ]
      }
      character_game_room_players: {
        Row: {
          joined_at: string
          last_seen_at: string
          role: string
          room_id: string
          state: string
          user_id: string
        }
        Insert: {
          joined_at?: string
          last_seen_at?: string
          role?: string
          room_id: string
          state?: string
          user_id: string
        }
        Update: {
          joined_at?: string
          last_seen_at?: string
          role?: string
          room_id?: string
          state?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_game_room_players_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "character_game_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      character_game_rooms: {
        Row: {
          created_at: string
          current_round: number
          difficulty: string
          finished_at: string | null
          game_type: string
          host_id: string
          id: string
          max_players: number
          round_seed: number
          rounds: number
          started_at: string | null
          status: string
        }
        Insert: {
          created_at?: string
          current_round?: number
          difficulty?: string
          finished_at?: string | null
          game_type?: string
          host_id: string
          id?: string
          max_players?: number
          round_seed?: number
          rounds?: number
          started_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          current_round?: number
          difficulty?: string
          finished_at?: string | null
          game_type?: string
          host_id?: string
          id?: string
          max_players?: number
          round_seed?: number
          rounds?: number
          started_at?: string | null
          status?: string
        }
        Relationships: []
      }
      character_game_rounds: {
        Row: {
          answer_hash: string
          character_id: string
          closed_at: string | null
          hints: Json
          id: string
          opened_at: string
          points_available: number
          revealed_hint_indexes: number[]
          room_id: string
          round_number: number
          status: string
          winner_id: string | null
        }
        Insert: {
          answer_hash?: string
          character_id: string
          closed_at?: string | null
          hints?: Json
          id?: string
          opened_at?: string
          points_available?: number
          revealed_hint_indexes?: number[]
          room_id: string
          round_number: number
          status?: string
          winner_id?: string | null
        }
        Update: {
          answer_hash?: string
          character_id?: string
          closed_at?: string | null
          hints?: Json
          id?: string
          opened_at?: string
          points_available?: number
          revealed_hint_indexes?: number[]
          room_id?: string
          round_number?: number
          status?: string
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "character_game_rounds_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "character_game_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      churches: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          name: string
          normalized_name: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          normalized_name: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          normalized_name?: string
        }
        Relationships: []
      }
      daily_verse_comment_likes: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_verse_comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "daily_verse_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_verse_comments: {
        Row: {
          author_avatar_url: string | null
          author_name: string
          body: string | null
          created_at: string
          gif_url: string | null
          id: string
          user_id: string
          verse_date: string
        }
        Insert: {
          author_avatar_url?: string | null
          author_name: string
          body?: string | null
          created_at?: string
          gif_url?: string | null
          id?: string
          user_id: string
          verse_date: string
        }
        Update: {
          author_avatar_url?: string | null
          author_name?: string
          body?: string | null
          created_at?: string
          gif_url?: string | null
          id?: string
          user_id?: string
          verse_date?: string
        }
        Relationships: []
      }
      daily_verse_likes: {
        Row: {
          created_at: string
          id: string
          user_id: string
          verse_date: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          verse_date: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          verse_date?: string
        }
        Relationships: []
      }
      daily_verse_shares: {
        Row: {
          created_at: string
          id: string
          user_id: string
          verse_date: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          verse_date: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          verse_date?: string
        }
        Relationships: []
      }
      daily_verses: {
        Row: {
          book: number
          chapter: number
          created_at: string
          id: string
          ord: number
          ref_label: string
          verse_end: number | null
          verse_start: number
        }
        Insert: {
          book: number
          chapter: number
          created_at?: string
          id?: string
          ord: number
          ref_label: string
          verse_end?: number | null
          verse_start: number
        }
        Update: {
          book?: number
          chapter?: number
          created_at?: string
          id?: string
          ord?: number
          ref_label?: string
          verse_end?: number | null
          verse_start?: number
        }
        Relationships: []
      }
      demo_users: {
        Row: {
          avatar_char: string
          display_name: string
          id: string
          level: number
          streak: number
          title: string
          xp: number
        }
        Insert: {
          avatar_char: string
          display_name: string
          id?: string
          level: number
          streak: number
          title: string
          xp: number
        }
        Update: {
          avatar_char?: string
          display_name?: string
          id?: string
          level?: number
          streak?: number
          title?: string
          xp?: number
        }
        Relationships: []
      }
      diary_entries: {
        Row: {
          answer: string
          created_at: string
          id: string
          lesson_id: string
          lesson_title: string
          question: string
          updated_at: string
          user_id: string
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          lesson_id: string
          lesson_title: string
          question: string
          updated_at?: string
          user_id: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          lesson_id?: string
          lesson_title?: string
          question?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      disciple_modules: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          ord: number
          title: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id: string
          ord: number
          title: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          ord?: number
          title?: string
        }
        Relationships: []
      }
      disciple_trails: {
        Row: {
          created_at: string
          id: string
          lesson_id: string | null
          module_id: string
          ord: number
          title: string
        }
        Insert: {
          created_at?: string
          id: string
          lesson_id?: string | null
          module_id: string
          ord: number
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          lesson_id?: string | null
          module_id?: string
          ord?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "disciple_trails_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "disciple_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      discipleship_assignments: {
        Row: {
          assigned_at: string
          content_id: string
          content_type: string
          created_at: string
          disciple_id: string
          group_id: string | null
          id: string
          leader_id: string
          status: string
        }
        Insert: {
          assigned_at?: string
          content_id: string
          content_type: string
          created_at?: string
          disciple_id: string
          group_id?: string | null
          id?: string
          leader_id: string
          status?: string
        }
        Update: {
          assigned_at?: string
          content_id?: string
          content_type?: string
          created_at?: string
          disciple_id?: string
          group_id?: string | null
          id?: string
          leader_id?: string
          status?: string
        }
        Relationships: []
      }
      discipulos: {
        Row: {
          alert: string | null
          created_at: string | null
          data_entrada: string | null
          email: string | null
          id: string
          level: number | null
          name: string
          progress: number | null
          status: string | null
          streak: number | null
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          alert?: string | null
          created_at?: string | null
          data_entrada?: string | null
          email?: string | null
          id?: string
          level?: number | null
          name: string
          progress?: number | null
          status?: string | null
          streak?: number | null
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          alert?: string | null
          created_at?: string | null
          data_entrada?: string | null
          email?: string | null
          id?: string
          level?: number | null
          name?: string
          progress?: number | null
          status?: string | null
          streak?: number | null
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      encontro_presenca: {
        Row: {
          created_at: string | null
          discipulo_id: string
          encontro_id: string
          id: string
          presente: boolean | null
        }
        Insert: {
          created_at?: string | null
          discipulo_id: string
          encontro_id: string
          id?: string
          presente?: boolean | null
        }
        Update: {
          created_at?: string | null
          discipulo_id?: string
          encontro_id?: string
          id?: string
          presente?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "encontro_presenca_encontro_id_fkey"
            columns: ["encontro_id"]
            isOneToOne: false
            referencedRelation: "encontros"
            referencedColumns: ["id"]
          },
        ]
      }
      encontros: {
        Row: {
          assunto: string
          created_at: string | null
          data: string
          grupo_id: string | null
          grupo_nome: string
          id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          assunto: string
          created_at?: string | null
          data: string
          grupo_id?: string | null
          grupo_nome: string
          id?: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          assunto?: string
          created_at?: string | null
          data?: string
          grupo_id?: string | null
          grupo_nome?: string
          id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      etapas: {
        Row: {
          created_at: string | null
          data_conclusao: string | null
          data_inicio: string | null
          discipulo_id: string
          etapa: number
          id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_conclusao?: string | null
          data_inicio?: string | null
          discipulo_id: string
          etapa: number
          id?: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_conclusao?: string | null
          data_inicio?: string | null
          discipulo_id?: string
          etapa?: number
          id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      feed_comment_likes: {
        Row: {
          comment_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "feed_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_comments: {
        Row: {
          author_avatar_url: string | null
          author_name: string
          body: string
          created_at: string
          gif_url: string | null
          id: string
          item_id: string
          user_id: string
        }
        Insert: {
          author_avatar_url?: string | null
          author_name: string
          body?: string
          created_at?: string
          gif_url?: string | null
          id?: string
          item_id: string
          user_id: string
        }
        Update: {
          author_avatar_url?: string | null
          author_name?: string
          body?: string
          created_at?: string
          gif_url?: string | null
          id?: string
          item_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_comments_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "feed_items"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_items: {
        Row: {
          author_avatar_url: string | null
          author_name: string
          body: string
          created_at: string
          id: string
          kind: string
          user_id: string
        }
        Insert: {
          author_avatar_url?: string | null
          author_name: string
          body?: string
          created_at?: string
          id?: string
          kind: string
          user_id: string
        }
        Update: {
          author_avatar_url?: string | null
          author_name?: string
          body?: string
          created_at?: string
          id?: string
          kind?: string
          user_id?: string
        }
        Relationships: []
      }
      feed_likes: {
        Row: {
          created_at: string
          item_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          item_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          item_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_likes_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "feed_items"
            referencedColumns: ["id"]
          },
        ]
      }
      friendships: {
        Row: {
          created_at: string
          friend_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          friend_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          friend_id?: string
          user_id?: string
        }
        Relationships: []
      }
      game_scores: {
        Row: {
          best_streak: number
          correct_answers: number
          game_key: string
          id: string
          played_at: string
          room_id: string | null
          rounds: number
          score: number
          user_id: string
        }
        Insert: {
          best_streak?: number
          correct_answers?: number
          game_key: string
          id?: string
          played_at?: string
          room_id?: string | null
          rounds?: number
          score?: number
          user_id: string
        }
        Update: {
          best_streak?: number
          correct_answers?: number
          game_key?: string
          id?: string
          played_at?: string
          room_id?: string | null
          rounds?: number
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_scores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          created_at: string
          disciple_id: string
          group_id: string
        }
        Insert: {
          created_at?: string
          disciple_id: string
          group_id: string
        }
        Update: {
          created_at?: string
          disciple_id?: string
          group_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          created_at: string
          id: string
          leader_id: string
          name: string
          topic: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          leader_id: string
          name: string
          topic?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          leader_id?: string
          name?: string
          topic?: string | null
        }
        Relationships: []
      }
      grupos: {
        Row: {
          created_at: string | null
          data_criacao: string | null
          id: string
          lider_id: string | null
          membros: string[] | null
          nome: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_criacao?: string | null
          id?: string
          lider_id?: string | null
          membros?: string[] | null
          nome: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_criacao?: string | null
          id?: string
          lider_id?: string | null
          membros?: string[] | null
          nome?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      highlights: {
        Row: {
          color: string
          content_id: string
          content_type: string
          created_at: string
          end_offset: number
          field_key: string
          highlighted_text: string
          id: string
          start_offset: number
          user_id: string
        }
        Insert: {
          color?: string
          content_id: string
          content_type: string
          created_at?: string
          end_offset: number
          field_key?: string
          highlighted_text: string
          id?: string
          start_offset: number
          user_id: string
        }
        Update: {
          color?: string
          content_id?: string
          content_type?: string
          created_at?: string
          end_offset?: number
          field_key?: string
          highlighted_text?: string
          id?: string
          start_offset?: number
          user_id?: string
        }
        Relationships: []
      }
      leader_disciples: {
        Row: {
          created_at: string
          disciple_id: string
          leader_id: string
        }
        Insert: {
          created_at?: string
          disciple_id: string
          leader_id: string
        }
        Update: {
          created_at?: string
          disciple_id?: string
          leader_id?: string
        }
        Relationships: []
      }
      leader_meetings: {
        Row: {
          created_at: string
          id: string
          leader_id: string
          location: string | null
          scheduled_at: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          leader_id: string
          location?: string | null
          scheduled_at: string
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          leader_id?: string
          location?: string | null
          scheduled_at?: string
          title?: string
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          completed_at: string
          id: string
          lesson_id: string
          user_id: string
          xp_gained: number
        }
        Insert: {
          completed_at?: string
          id?: string
          lesson_id: string
          user_id: string
          xp_gained?: number
        }
        Update: {
          completed_at?: string
          id?: string
          lesson_id?: string
          user_id?: string
          xp_gained?: number
        }
        Relationships: []
      }
      lesson_share_texts: {
        Row: {
          created_at: string
          id: string
          lesson_id: string
          lesson_title: string
          share_text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          lesson_id: string
          lesson_title: string
          share_text: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          lesson_id?: string
          lesson_title?: string
          share_text?: string
          updated_at?: string
        }
        Relationships: []
      }
      mensagens: {
        Row: {
          conteudo: string
          created_at: string | null
          data_envio: string | null
          destinatario: string | null
          destinatario_id: string | null
          destinatario_nome: string | null
          id: string
          lida: boolean | null
          remetente_id: string | null
        }
        Insert: {
          conteudo: string
          created_at?: string | null
          data_envio?: string | null
          destinatario?: string | null
          destinatario_id?: string | null
          destinatario_nome?: string | null
          id?: string
          lida?: boolean | null
          remetente_id?: string | null
        }
        Update: {
          conteudo?: string
          created_at?: string | null
          data_envio?: string | null
          destinatario?: string | null
          destinatario_id?: string | null
          destinatario_nome?: string | null
          id?: string
          lida?: boolean | null
          remetente_id?: string | null
        }
        Relationships: []
      }
      mentor_memory: {
        Row: {
          category: string
          created_at: string
          fact: string
          id: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          fact: string
          id?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          fact?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      mentor_messages: {
        Row: {
          audio_duration_seconds: number | null
          audio_url: string | null
          content: string | null
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          audio_duration_seconds?: number | null
          audio_url?: string | null
          content?: string | null
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          audio_duration_seconds?: number | null
          audio_url?: string | null
          content?: string | null
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          audio_duration_seconds: number | null
          audio_url: string | null
          body: string | null
          created_at: string
          id: string
          read_at: string | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          audio_duration_seconds?: number | null
          audio_url?: string | null
          body?: string | null
          created_at?: string
          id?: string
          read_at?: string | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          audio_duration_seconds?: number | null
          audio_url?: string | null
          body?: string | null
          created_at?: string
          id?: string
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      mural_amens: {
        Row: {
          created_at: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mural_amens_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "mural_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      mural_posts: {
        Row: {
          amens_seed: number
          audio_duration_seconds: number | null
          audio_url: string | null
          author_name: string
          body: string | null
          created_at: string
          id: string
          is_answered: boolean
          user_id: string | null
        }
        Insert: {
          amens_seed?: number
          audio_duration_seconds?: number | null
          audio_url?: string | null
          author_name: string
          body?: string | null
          created_at?: string
          id?: string
          is_answered?: boolean
          user_id?: string | null
        }
        Update: {
          amens_seed?: number
          audio_duration_seconds?: number | null
          audio_url?: string | null
          author_name?: string
          body?: string | null
          created_at?: string
          id?: string
          is_answered?: boolean
          user_id?: string | null
        }
        Relationships: []
      }
      note_ai_actions: {
        Row: {
          action_type: string
          created_at: string
          id: string
          note_id: string
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string
          note_id: string
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string
          note_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "note_ai_actions_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          content: Json
          created_at: string
          exported_at: string | null
          id: string
          source_content_id: string | null
          source_content_title: string | null
          source_content_type: string | null
          source_type: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: Json
          created_at?: string
          exported_at?: string | null
          id?: string
          source_content_id?: string | null
          source_content_title?: string | null
          source_content_type?: string | null
          source_type?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string
          exported_at?: string | null
          id?: string
          source_content_id?: string | null
          source_content_title?: string | null
          source_content_type?: string | null
          source_type?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_char: string
          avatar_url: string | null
          bible_version: string
          bio: string | null
          church_id: string | null
          church_name: string | null
          created_at: string
          display_name: string
          first_name: string | null
          id: string
          is_leader: boolean
          last_activity_date: string | null
          last_name: string | null
          last_seen_at: string | null
          notify_devocional: boolean
          onboarded: boolean
          streak: number
          updated_at: string
          username: string | null
          xp: number
        }
        Insert: {
          avatar_char?: string
          avatar_url?: string | null
          bible_version?: string
          bio?: string | null
          church_id?: string | null
          church_name?: string | null
          created_at?: string
          display_name?: string
          first_name?: string | null
          id: string
          is_leader?: boolean
          last_activity_date?: string | null
          last_name?: string | null
          last_seen_at?: string | null
          notify_devocional?: boolean
          onboarded?: boolean
          streak?: number
          updated_at?: string
          username?: string | null
          xp?: number
        }
        Update: {
          avatar_char?: string
          avatar_url?: string | null
          bible_version?: string
          bio?: string | null
          church_id?: string | null
          church_name?: string | null
          created_at?: string
          display_name?: string
          first_name?: string | null
          id?: string
          is_leader?: boolean
          last_activity_date?: string | null
          last_name?: string | null
          last_seen_at?: string | null
          notify_devocional?: boolean
          onboarded?: boolean
          streak?: number
          updated_at?: string
          username?: string | null
          xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "profiles_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: string
          p256dh: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reading_plan_days: {
        Row: {
          application: string
          context: string
          created_at: string
          day: number
          focus: string
          id: string
          passage_api_refs: string[]
          plan_id: string
          prayer: string
          reflection: string
          refs: string[]
          updated_at: string
        }
        Insert: {
          application: string
          context: string
          created_at?: string
          day: number
          focus: string
          id?: string
          passage_api_refs: string[]
          plan_id: string
          prayer: string
          reflection: string
          refs: string[]
          updated_at?: string
        }
        Update: {
          application?: string
          context?: string
          created_at?: string
          day?: number
          focus?: string
          id?: string
          passage_api_refs?: string[]
          plan_id?: string
          prayer?: string
          reflection?: string
          refs?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_plan_days_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "reading_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      reading_plans: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          intro: string
          minutes_per_day: number
          sort_order: number
          title: string
          total_days: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          icon: string
          id: string
          intro: string
          minutes_per_day: number
          sort_order?: number
          title: string
          total_days: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          intro?: string
          minutes_per_day?: number
          sort_order?: number
          title?: string
          total_days?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_friend: { Args: { _target: string }; Returns: undefined }
      are_friends: { Args: { _a: string; _b: string }; Returns: boolean }
      challenge_lesson_ids: {
        Args: { _scope_id: string; _scope_type: string }
        Returns: string[]
      }
      challenge_progress: {
        Args: { _challenge_id: string; _user: string }
        Returns: number
      }
      create_character_game_room: {
        Args: {
          _difficulty: string
          _game_type: string
          _max_players: number
          _rounds: number
        }
        Returns: string
      }
      ensure_character_game_round: {
        Args: {
          _answer_hash?: string
          _character_id: string
          _hints?: Json
          _room_id: string
          _round_number: number
        }
        Returns: {
          answer_hash: string
          character_id: string
          closed_at: string | null
          hints: Json
          id: string
          opened_at: string
          points_available: number
          revealed_hint_indexes: number[]
          room_id: string
          round_number: number
          status: string
          winner_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "character_game_rounds"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      find_or_create_church: { Args: { _name: string }; Returns: string }
      finish_challenge_step: {
        Args: { _challenge_id: string }
        Returns: undefined
      }
      get_game_leaderboard: {
        Args: { _game_key: string; _limit?: number }
        Returns: {
          avatar_char: string
          avatar_url: string
          best_score: number
          best_streak: number
          display_name: string
          games_played: number
          position: number
          total_score: number
          user_id: string
          username: string
        }[]
      }
      get_my_discipleship_tree: {
        Args: never
        Returns: {
          avatar_url: string
          depth: number
          direction: string
          display_name: string
          id: string
          parent_id: string
          username: string
          xp: number
        }[]
      }
      invite_character_game_player: {
        Args: { _room_id: string; _user_id: string }
        Returns: {
          joined_at: string
          last_seen_at: string
          role: string
          room_id: string
          state: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "character_game_room_players"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      is_character_game_member: { Args: { _room_id: string }; Returns: boolean }
      normalize_church_name: { Args: { _name: string }; Returns: string }
      record_game_result: {
        Args: {
          _best_streak?: number
          _correct_answers?: number
          _game_key: string
          _rounds?: number
          _score: number
        }
        Returns: {
          best_streak: number
          correct_answers: number
          game_key: string
          id: string
          played_at: string
          room_id: string | null
          rounds: number
          score: number
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "game_scores"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      remove_character_game_player: {
        Args: { _room_id: string; _user_id: string }
        Returns: boolean
      }
      respond_character_game_invite: {
        Args: { _accept: boolean; _room_id: string }
        Returns: {
          joined_at: string
          last_seen_at: string
          role: string
          room_id: string
          state: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "character_game_room_players"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      reveal_character_game_hint: {
        Args: { _hint_index: number; _round_id: string }
        Returns: {
          answer_hash: string
          character_id: string
          closed_at: string | null
          hints: Json
          id: string
          opened_at: string
          points_available: number
          revealed_hint_indexes: number[]
          room_id: string
          round_number: number
          status: string
          winner_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "character_game_rounds"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      submit_character_game_answer: {
        Args: { _answer_hash: string; _is_correct: boolean; _round_id: string }
        Returns: {
          answer_hash: string
          character_id: string
          closed_at: string | null
          hints: Json
          id: string
          opened_at: string
          points_available: number
          revealed_hint_indexes: number[]
          room_id: string
          round_number: number
          status: string
          winner_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "character_game_rounds"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      touch_last_seen: { Args: never; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
