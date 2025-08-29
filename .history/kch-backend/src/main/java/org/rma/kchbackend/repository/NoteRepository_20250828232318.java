package org.rma.kchbackend.repository;

import org.rma.kchbackend.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    
    @Query("SELECT n FROM Note n WHERE n.text = :text")
    java.util.Optional<Note> findByText(@Param("text") String text);
}
